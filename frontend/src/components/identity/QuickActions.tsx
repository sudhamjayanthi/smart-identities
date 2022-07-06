import { useEffect, useState } from "react";
import { erc20ABI, useContractRead, useContractWrite, useSigner } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

import Modal from "@components/Modal";
import { EXPLORER } from "@lib/constants";
import toast from "react-hot-toast";
import PickToken from "./PickToken";
import { ethers } from "ethers";

interface token {
    chainId: number,
    name: string,
    symbol: string,
    decimals: number,
    logoURI: string,
    address: string,
    id: number
}

const QuickActions = ({ isOwner, identityConfig }) => {
    const addTxn = useAddRecentTransaction();

    const { data: withdrawTx, write: withdraw } = useContractWrite(identityConfig, "withdraw");
    const { data: disintegrateTx, write: disintegrate } = useContractWrite(identityConfig, "disintegrate");

    const { data: acceptedTokens } = useContractRead(identityConfig, "getAcceptedTokens")

    const [token, setToken] = useState<token>()

    const { data: signer } = useSigner()
    const { data: acceptErc20Tx, write: acceptErc20 } = useContractWrite(identityConfig, "acceptErc20");

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

    useEffect(() => {
        if (withdrawTx?.hash) {
            console.log(`cashing out, txn :  ${EXPLORER}/tx/${withdrawTx?.hash}`)
            addTxn({
                hash: withdrawTx?.hash,
                description: 'cashing out',
            })
        }
    }, [withdrawTx])

    useEffect(() => {
        if (disintegrateTx?.hash) {
            console.log(`disintegrating, txn : ${EXPLORER}/tx/${disintegrateTx?.hash}`)
            addTxn({
                hash: disintegrateTx?.hash,
                description: 'dis-integrating identity',
            })
        }
    }, [disintegrateTx])

    return (
        <>
            {isOwner && <div>
                <h2 className="subheading">Owner Actions</h2>
                <div className="flex gap-4 mt-4">
                    <Modal title="Accept ERC20" toggleText="ACCEPT ERC20" toggleStyle="btn bg-blue-700" icon={<svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M11 2.75C15.5375 2.75 19.25 6.4625 19.25 11C19.25 15.5375 15.5375 19.25 11 19.25C6.4625 19.25 2.75 15.5375 2.75 11C2.75 6.4625 6.4625 2.75 11 2.75ZM11 1.375C5.70625 1.375 1.375 5.70625 1.375 11C1.375 16.2937 5.70625 20.625 11 20.625C16.2937 20.625 20.625 16.2937 20.625 11C20.625 5.70625 16.2937 1.375 11 1.375Z" fill="white" />
                        <path d="M16.5 10.3125H11.6875V5.5H10.3125V10.3125H5.5V11.6875H10.3125V16.5H11.6875V11.6875H16.5V10.3125Z" fill="white" />
                    </svg>
                    }>
                        <div className="flex gap-3 mt-4">
                            <PickToken callback={(token: token) => setToken(token)} />
                            <button onClick={onSubmit} className="btn bg-blue-600 flex-1">Confirm</button>
                        </div>
                    </Modal>
                    <Modal title="Are you sure?" toggleText="CASHOUT" toggleStyle="btn bg-green-600" icon={<svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 8.23C9.2 7.493 7.793 6.98 6.5 6.948M3 15.23C3.752 16.155 5.15 16.683 6.5 16.728M6.5 6.947C4.961 6.909 3.583 7.551 3.583 9.307C3.583 12.537 10 10.922 10 14.153C10 15.995 8.292 16.787 6.5 16.728M6.5 6.947V5M6.5 16.729V19M21 12H13M13 12L16.84 8M13 12L16.84 16" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                    }>
                        <div className="flex flex-col gap-4 mt-4 text-gray-200">
                            <p>
                                Clicking confirm will transfer native and your accepted tokens to the owners according to their equities.
                                <br /><br />
                                <b>Make sure you have accepted the tokens to be withdrawn before proceeding!</b>
                            </p>
                            <button onClick={() => {
                                withdraw();
                            }} className="btn bg-blue-600 font-medium block">Confirm</button>
                        </div>
                    </Modal>
                    <Modal title="ARE YOU SURE?" toggleText="DIS-INTEGRATE" toggleStyle="btn bg-red-600" icon={<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M9 7C9 6.20435 9.31607 5.44129 9.87868 4.87868C10.4413 4.31607 11.2044 4 12 4V4C12.7956 4 13.5587 4.31607 14.1213 4.87868C14.6839 5.44129 15 6.20435 15 7V7M9 7H15M9 7H6M15 7H18M20 7H18M4 7H6M6 7V18C6 18.5304 6.21071 19.0391 6.58579 19.4142C6.96086 19.7893 7.46957 20 8 20H16C16.5304 20 17.0391 19.7893 17.4142 19.4142C17.7893 19.0391 18 18.5304 18 18V7" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>}
                    >
                        <div className="flex flex-col gap-4 mt-4 text-gray-200">
                            <span>
                                Clicking confirm will withdraw all tokens and destroy the identity forever and this action cannot be reversed.<br /><br />
                                <span>MAKE SURE YOU HAVE ACCEPTED TOKENS YOU WANT TO WITHDRAW OR <b>YOU RISK LOCKING UP THE FUNDS FOREVER!</b></span>
                            </span>
                            <button onClick={() => {
                                disintegrate();
                            }} className="btn bg-red-600 font-medium block">Confirm</button>
                        </div>
                    </Modal>
                </div>
            </div>
            }
        </>)
}

export default QuickActions;