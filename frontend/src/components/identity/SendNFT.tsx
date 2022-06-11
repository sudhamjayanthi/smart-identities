import { ethers } from "ethers";
import { useEffect, useState } from 'react'
import { erc721ABI, useAccount, useContractWrite, useSigner, useWaitForTransaction } from "wagmi";

import { useForm } from "react-hook-form";
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';

import Modal from "@components/Modal";
import { EXPLORER } from "@lib/constants";
import toast from "react-hot-toast";

interface nft {
    address: string,
    tokenId: string
}

const SendNFT = ({ identityConfig }) => {
    const { data: user } = useAccount()
    const { data: signer } = useSigner()

    const addTxn = useAddRecentTransaction();

    const identityAddress = identityConfig.addressOrName

    const [approved, setApproved] = useState(false)
    const [approveTxnHash, setApproveTxnHash] = useState()

    const { data: approveTxn } = useWaitForTransaction({
        hash: approveTxnHash,
    });

    const { register, handleSubmit, formState: { errors }, setError, watch } = useForm();

    const { data: transferTx, write: transferNFT } = useContractWrite(identityConfig, "transferNFT");

    const onSubmit = async (data: nft) => {
        if (approved) {
            transferNFT({
                args: [watch("address"), watch("tokenId")]
            })
        } else {
            try {
                const nftContract = new ethers.Contract(data.address, erc721ABI, signer)

                const owner = await nftContract.ownerOf(data.tokenId)
                const userIsOwner = owner.toLowerCase() === user?.address.toLowerCase();

                if (userIsOwner) {
                    const txn = await nftContract.approve(identityAddress, data.tokenId)
                    setApproveTxnHash(txn.hash)
                } else {
                    toast.error("You don't own this nft!")
                }

            } catch (e) {
                console.log(e)
                toast.error("Incorrect collection address or token id!")
            }
        }

    }

    const onChange = async () => {
        const address = watch("address")
        const tokenId = watch("tokenId")

        if (address.match(/^0x[0-9a-fA-F]{40}$/)) {
            try {
                const nftContract = new ethers.Contract(address.toString(), erc721ABI, signer)
                const approvedAccount = await nftContract.getApproved(tokenId.toString())
                const identityIsApproved = approvedAccount.toLowerCase() === identityConfig.addressOrName.toLowerCase();
                setApproved(identityIsApproved)
            } catch (e) {
                console.log("not a erc20 address")
            }
        }

    }

    useEffect(() => {
        if (transferTx?.hash) {
            console.log(`transferring nft, txn : ${EXPLORER}/tx/${transferTx?.hash}`)
            addTxn({
                hash: transferTx?.hash,
                description: 'transferring nft to identity',
            })
        }
    }, [transferTx])

    // useEffect(() => {
    //     if (approveTxn) {
    //         console.log(`transferring nft, txn : ${EXPLORER}/tx/${approveTxnHash}`)
    //         addTxn({
    //             hash: approveTxnHash,
    //             description: 'transferring nft to identity',
    //         })
    //     }
    // }, [approveTxn, approveTxnHash])


    return <>
        <Modal title="Transfer NFT" toggleText="send nft" toggleStyle="btn from-orange-500 to-yellow-500">
            <form onChange={onChange} onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-3 mt-4">
                    <label htmlFor="address">Collection Address</label>
                    <input
                        type="text"
                        name="address"
                        id="address"
                        className="outline-none border-slate-300 border-2 p-1 rounded-md focus:border-blue-300"
                        {...register("address", { pattern: /^0x[a-fA-F0-9]{40}$/, required: true })}
                    />
                    {errors.address && <span className="text-red-400">Please enter a valid address</span>}

                    <label htmlFor="tokenId">Token ID</label>
                    <input
                        type="number"
                        name="tokenId"
                        id="tokenId"
                        className="outline-none border-slate-300 border-2 p-1 rounded-md focus:border-blue-300"
                        {...register("tokenId")}
                    />
                    {errors.tokenId && <span className="text-red-400">Please enter a token id</span>}
                    {approved ? <button type="submit" className="btn bg-orange-600" >Transfer</button> : <button type="submit" className="btn bg-blue-600">Approve</button>}

                    {/* {approved ? <button onClick={() => {
                        if (approved) {
                            transferNFT({
                                args: [watch("address"), watch("tokenId")]
                            })
                        }
                    }} className="btn bg-orange-600" >Transfer</button> : (
                        <>
                            <button type="submit" className="btn bg-blue-600">Approve</button>
                            <button className="btn bg-orange-600 cursor-not-allowed" disabled>Transfer</button>
                        </>
                    )} */}
                </div>
            </form>
        </Modal>
    </>
}

export default SendNFT