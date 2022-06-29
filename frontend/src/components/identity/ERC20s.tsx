import { ethers } from "ethers";

import { useEffect, useState } from 'react'

import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { erc20ABI, useContractRead, useContractWrite, useSigner } from "wagmi";

import Modal from "@components/Modal";
import ERC20 from "./ERC20";

import { EXPLORER } from "@lib/constants";
import toast from "react-hot-toast";
import PickToken from "./PickToken";

interface token {
    chainId: number,
    name: string,
    symbol: string,
    decimals: number,
    logoURI: string,
    address: string,
    id: number
}


function NFTs({ isOwner, identityConfig }) {
    const [token, setToken] = useState<token>()

    const { data: signer } = useSigner()
    const { data: acceptedTokens } = useContractRead(identityConfig, "getAcceptedTokens")
    const { data: acceptErc20Tx, write: acceptErc20 } = useContractWrite(identityConfig, "acceptErc20");


    const addTxn = useAddRecentTransaction();

    const onSubmit = async () => {

        if (!token) {
            toast.error("Please select a token!")
            return
        }
        if (acceptedTokens.includes(token.address)) {
            toast.error("Already accepted this token");
            return
        }

        try {
            const contract = new ethers.Contract(token.address, erc20ABI, signer)
            const bal = await contract.balanceOf(identityConfig.addressOrName) // validates if the given address is a erc20 contract
            console.log(bal)
            acceptErc20({ args: [token.address] })
        } catch (e) {
            console.log(e)
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
        <div className="flex flex-col">
            <h2 className="subheading">ERC20s</h2>
            <div>
                {acceptedTokens?.length !== 0 ? acceptedTokens?.map(token => <ERC20 key={token} address={token} identity={identityConfig.addressOrName} />) : <span className="text-gray-400">No tokens accepted. Accept tokens to see their balances here!</span>}
            </div>
            {/* {isOwner &&
                <Modal title="Accept ERC20" toggleText="accept another" toggleStyle="btn bg-gradient-to-r from-blue-700 to-sky-400 ">
                    <div className="flex flex-col gap-3 mt-4">
                        <PickToken callback={(token: token) => setToken(token)} />
                        <button onClick={onSubmit} className="btn bg-blue-600">Confirm</button>
                    </div>
                </Modal>
            } */}
        </div>
    )
}

export default NFTs