import { useEffect } from "react";
import { useContractWrite } from "wagmi";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";

import Modal from "@components/Modal";
import { EXPLORER } from "@lib/constants";

const QuickActions = ({ isOwner, identityConfig }) => {
    const addTxn = useAddRecentTransaction();

    const { data: withdrawTx, write: withdraw } = useContractWrite(identityConfig, "withdraw");
    const { data: disintegrateTx, write: disintegrate } = useContractWrite(identityConfig, "disintegrate");

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
        <div>
            <h2 className="subheading">Owner Actions</h2>
            <div className="flex gap-4 mt-4">
                {/* {isOwner &&
                <Modal title="Accept ERC20" toggleText="accept another" toggleStyle="btn bg-gradient-to-r from-blue-700 to-sky-400 ">
                    <div className="flex flex-col gap-3 mt-4">
                        <PickToken callback={(token: token) => setToken(token)} />
                        <button onClick={onSubmit} className="btn bg-blue-600">Confirm</button>
                    </div>
                </Modal>
            } */}
                {isOwner && <Modal title="Withdraw all the native and ERC20 tokens" toggleText="CASHOUT" toggleStyle="btn bg-green-600">
                    <div className="flex flex-col gap-4 mt-4">
                        <p>
                            Clicking confirm will transfer all tokens to the owners according to their equities.
                            <br /><br />
                            <b> Note : Make sure you have accepted tokens you want to withdraw before continuing!</b>
                        </p>
                        <button onClick={() => {
                            withdraw();
                        }} className="btn bg-blue-600 font-medium block">Confirm</button>
                    </div>
                </Modal>}
                {isOwner && <Modal title="ARE YOU SURE?" toggleText="DIS-INTEGRATE" toggleStyle="btn bg-red-600">
                    <div className="flex flex-col gap-4 mt-4">
                        <span>
                            Clicking confirm will withdraw all tokens and <b>destroy the identity forever.</b>
                            <br /><br />
                            <span> Note : Make sure you have accepted tokens you want to withdraw or <b>your funds will forever be locked!</b></span>
                        </span>
                        <button onClick={() => {
                            disintegrate();
                        }} className="btn bg-red-600 font-medium block">Confirm</button>
                    </div>
                </Modal>}
                {/* <a target="_blank" href={`${EXPLORER}/address/${identityConfig.addressOrName}`} className="btn bg-blue-600">🔍 view on explorer</a> */}
            </div>
        </div>)
}

export default QuickActions;