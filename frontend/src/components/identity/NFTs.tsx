import { ethers } from "ethers";
import { useEffect, useState } from 'react'
import { erc721ABI, useContractRead, useContractWrite, useSigner } from "wagmi";

import { useForm } from "react-hook-form";
import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';

import NFT from "./NFT";
import Modal from "@components/Modal";
import { EXPLORER } from "@lib/constants";
import toast, { Toaster } from "react-hot-toast";

interface nft {
    address: string,
    tokenId: string
}

function NFTs({ isOwner, identityConfig }) {
    const { data: signer } = useSigner()
    const [approved, setApproved] = useState(false)

    const addTxn = useAddRecentTransaction();

    const { data: nfts } = useContractRead(identityConfig, "getNfts")
    const { data: transferNFTTx, write: transferNFT } = useContractWrite(identityConfig, "transferNFT");

    const { register, handleSubmit, formState: { errors }, setError, watch } = useForm();

    const onSubmit = async (data: nft) => {
        console.log(data)
        try {
            const nftContract = new ethers.Contract(data.address, erc721ABI, signer)
            const ownerAccount: string = await nftContract.ownerOf(data.tokenId)
            const approvedAccount: string = await nftContract.getApproved(data.tokenId)
            const identityAddress: string = identityConfig.addressOrName

            const identityIsApproved = approvedAccount.toLowerCase() === identityAddress.toLowerCase();
            const identityIsOwner = ownerAccount.toLowerCase() === identityAddress.toLowerCase();
            setApproved(identityIsApproved);


            if (!identityIsOwner) {
                if (!identityIsApproved) {
                    const txn = await nftContract.approve(identityAddress, data.tokenId)
                    console.log(txn.hash)

                    const approvedAccount: string = await nftContract.getApproved(data.tokenId)
                    const identityIsApproved = approvedAccount.toLowerCase() === identityAddress.toLowerCase();
                    setApproved(identityIsApproved);

                }
            } else {
                alert("already transferred nft to the identity")
            }

        } catch (e) {
            console.log(e)
            setError("address", { type: "custom", message: "not a valid nft contract" })
        }
    }

    const onChange = async (e) => {
        try {
            const address = watch("address")
            const tokenId = watch("tokenId")

            const nftContract = new ethers.Contract(address.toString(), erc721ABI, signer)
            const approvedAccount: string = await nftContract.getApproved(tokenId.toString())
            const identityIsApproved = approvedAccount.toLowerCase() === identityConfig.addressOrName.toLowerCase();

            setApproved(identityIsApproved)
        } catch (e) {
            console.log("error occured in onChange")
        }


    }

    useEffect(() => {
        if (transferNFTTx?.hash) {
            console.log(`transferring nft, txn : ${EXPLORER}/tx/${transferNFTTx?.hash}`)
            addTxn({
                hash: transferNFTTx?.hash,
                description: 'transferring nft to identity',
            })
        }
    }, [transferNFTTx])


    return (
        <div className="flex flex-col gap-10">
            {/* <Toaster position="bottom-right" /> */}

            <h2 className="subheading">NFTs</h2>
            <div className="flex gap-10">
                {nfts ? nfts?.map((nft, idx) => <NFT key={idx} nftData={nft} />) : "No nfts found"}
            </div>
            {isOwner && <Modal title="Transfer NFT" toggleText="send another" toggleStyle="btn from-orange-500 to-yellow-500">
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
                        {errors.address && <span className="text-red-400">Please enter a valid collection address</span>}

                        <label htmlFor="tokenId">Token ID</label>
                        <input
                            type="number"
                            name="tokenId"
                            id="tokenId"
                            className="outline-none border-slate-300 border-2 p-1 rounded-md focus:border-blue-300"
                            {...register("tokenId")}
                        />
                        {errors.tokenId && <span className="text-red-400">Please enter a valid token id</span>}

                        {approved ? <button onClick={() => {
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
                        )}
                    </div>
                </form>
            </Modal>}</div>
    )
}

export default NFTs