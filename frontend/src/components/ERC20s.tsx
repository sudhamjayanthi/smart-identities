import { EXPLORER } from "@/lib/constants";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { useEffect, useState } from 'react'
import { useForm } from "react-hook-form";
import { erc20ABI, useContractRead, useContractWrite, useSigner, useToken } from "wagmi";
import Modal from "./Modal";
import Token from "./Token";

function NFTs({ isOwner, identityConfig }) {

    const { data: signer } = useSigner()
    const { data: acceptedTokens } = useContractRead(identityConfig, "getAcceptedTokens")
    const { data: acceptErc20Tx, write: acceptErc20 } = useContractWrite(identityConfig, "acceptErc20");

    const { register, handleSubmit, formState: { errors }, setError } = useForm();

    const addTxn = useAddRecentTransaction();

    const onSubmit = async (data) => {
        if (acceptedTokens.includes(data.address)) {
            alert("already accepted this token");
            return
        }

        try {
            const contract = new ethers.Contract(data.address, erc20ABI, signer)
            const bal = await contract.balanceOf(identityConfig.addressOrName) // validates if the given address is a erc20 contract
            console.log(bal)
            acceptErc20({ args: [data.address] })
        } catch (e) {
            console.log(e)
            setError("address", { type: "custom", message: "not a valid erc20 contract" })
        }

    }

    useEffect(() => {
        if (acceptErc20Tx?.hash) {
            console.log(`adding erc20 to accepted token, txn : ${EXPLORER}/tx/${acceptErc20Tx?.hash}`)
            addTxn({
                hash: acceptErc20Tx?.hash,
                description: 'adding erc20 to accepted token',
            })
        }
    }, [acceptErc20Tx])

    return (
        <div className="flex flex-col gap-5">
            <h2 className="subheading">Accepted ERC20s</h2>
            <div>
                {acceptedTokens?.map(token => <Token key={token} address={token} identity={identityConfig.addressOrName} />)}
            </div>
            {isOwner &&
                <Modal title="Accept ERC20" toggleText="accept another" toggleStyle="btn from-blue-700 to-sky-400 ">
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="flex flex-col gap-3 mt-4">
                            <label htmlFor="address">Token Address</label>
                            <input
                                type="text"
                                name="address"
                                id="address"
                                className="outline-none border-slate-300 border-2 p-1 rounded-md focus:border-blue-300"
                                {...register("address", { pattern: /^0x[a-fA-F0-9]{40}$/, required: true })}
                            />
                            {errors.address && <span className="text-red-400">Please enter a valid ERC20 contract address</span>}
                            <p>Clicking on confirm will open up a transaction prompt to add the token to the list of accepted tokens. Make sure it is a right ERC20 contract adddress or <b>you risk locking up all your funds.</b></p>
                            <button type="submit" className="btn bg-blue-600">Confirm</button>
                        </div>
                    </form>
                </Modal>
            }
        </div>
    )
}

export default NFTs