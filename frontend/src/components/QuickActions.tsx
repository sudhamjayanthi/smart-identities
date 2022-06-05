import { EXPLORER } from "@/lib/constants";
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useContractWrite } from "wagmi";
import Modal from "./Modal";

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

    return (<div className="shadow-lg border border-slate-200 p-5 rounded-lg w-[60%] -ml-5">
        <h2 className="subheading">quick actions</h2>
        <div className="flex gap-4 mt-4">
            {isOwner && <Modal title="Withdraw all the native and ERC20 tokens" toggleText="💰 cashout" toggleStyle="btn bg-green-600">
                <div className="flex flex-col gap-4 mt-4">
                    <p>
                        Clicking confirm will open a transaction prompt to transfer all the available native and ERC20 tokens to all owners according to their equities.
                        <br /><br />
                        <b> Note : Make sure you have added accepted tokens you want to withdraw before continuing!</b>
                    </p>
                    <button onClick={() => {
                        withdraw();
                    }} className="btn bg-blue-600 font-medium block">Confirm</button>
                </div>
            </Modal>}
            {isOwner && <Modal title="ARE YOU SURE?" toggleText="🗑️ cashout and destruct identity" toggleStyle="btn bg-red-600">
                <div className="flex flex-col gap-4 mt-4">
                    <span>
                        CLICKING CONFIRM WILL WITHDRAW ALL NATIVE AND ACCEPTED ERC20 TOKENS AND <b>DESTROY THE ENTIRE IDENTITY FOREVER.</b>
                    </span>
                    <button onClick={() => {
                        disintegrate();
                    }} className="btn bg-red-600 font-medium block">Confirm</button>
                </div>
            </Modal>}

            <a target="_blank" href={`${EXPLORER}/address/${identityConfig.addressOrName}`} className="btn bg-blue-600">🔍 view on explorer</a>

        </div>
    </div>)
}

export default QuickActions;