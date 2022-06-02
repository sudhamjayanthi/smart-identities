import { useAddRecentTransaction } from "@rainbow-me/rainbowkit";
import { useEffect } from "react";
import { useContractWrite } from "wagmi";
import Modal from "./Modal";

const QuickActions = ({ isOwner, identityConfig }) => {

    const { data: withdrawTx, write: withdraw } = useContractWrite(identityConfig, "withdraw");
    const { data: disintegrateTx, write: disintegrate } = useContractWrite(identityConfig, "disintegrate");
    const addTxn = useAddRecentTransaction();

    useEffect(() => {
        console.log(`cashing out, txn :  https://mumbai.polygonscan.com/tx/${withdrawTx?.hash}`)
        if (withdrawTx?.hash) addTxn({
            hash: withdrawTx?.hash,
            description: 'cashing out',
        })
    }, [withdrawTx])

    useEffect(() => {
        console.log(`disintegrating, txn : https://mumbai.polygonscan.com/tx/${disintegrateTx?.hash}`)
        if (disintegrateTx?.hash) addTxn({
            hash: disintegrateTx?.hash,
            description: 'dis-integrating identity',
        })
    }, [disintegrateTx])

    return (<div className="shadow-lg border border-slate-200 p-5 rounded-lg w-[60%] -ml-5">
        <h2 className="subheading">quick actions</h2>
        <div className="flex gap-4 mt-4">
            {isOwner && <Modal title="Withdraw all the native and ERC20 tokens" toggleText="💰 cashout" toggleStyle="btn bg-green-600">
                <p>
                    Clicking confirm will open a transaction prompt to transfer all the available native and ERC20 tokens to all owners according to their equities.
                    <b> Make sure you have added accepted tokens you want to withdraw before continuing!</b>
                </p>
                <button onClick={() => {
                    withdraw();
                }} className="btn bg-blue-600 block">Confirm</button>
            </Modal>}
            {isOwner && <Modal title="ARE YOU SURE?" toggleText="🗑️ cashout and destruct identity" toggleStyle="btn bg-red-600">
                CLICKING CONFIRM WILL WITHDRAW ALL NATIVE AND ACCEPTED ERC20 TOKENS AND <b>DESTROY THE ENTIRE IDENTITY FOREVER.</b>
                <button onClick={() => {
                    disintegrate();
                }} className="btn bg-blue-600 block">Confirm</button>
            </Modal>}

            <a target="_blank" href={`https://mumbai.polygonscan.com/address/${identityConfig.addressOrName}`} className="btn bg-blue-600">🔍 view on explorer</a>

        </div>
    </div>)
}

export default QuickActions;