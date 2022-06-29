import { EXPLORER } from "@/lib/constants"
import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { ethers } from "ethers"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useSendTransaction } from "wagmi"
import Modal from "../Modal"


const SendERC20 = ({ to }) => {

    const [amount, setAmount] = useState<string>()
    const addTxn = useAddRecentTransaction();

    const { data: txn, isLoading, isError, error, sendTransaction } = useSendTransaction()

    useEffect(() => {
        if (txn) {
            console.log(`sending eth, txn : ${EXPLORER}/tx/${txn?.hash}`)
            addTxn({
                hash: txn?.hash,
                description: 'sending eth to identity',
            })
        }
    }, [txn, isLoading])

    useEffect(() => {
        if (isError) {
            console.log("failed to send eth : \n", error)
            toast.error("Error occurred, please try again!")
        }
    }, [isError])


    return (
        <Modal title="Send ETH" toggleText="ETH" toggleStyle="btn bg-blue-500">
            <div className="flex items-center my-4 border-2 rounded-lg p-2">
                <input className="flex-1 text-lg font-bold outline-none px-2" placeholder="0.0" type="number" onChange={e => setAmount(e.target.value)} />
            </div>
            <button className="btn bg-blue-600 w-full font-medium" onClick={() => sendTransaction({
                request: {
                    to: to,
                    value: ethers.utils.parseEther(`${amount && amount}`), // 1 ETH
                },
            })}>Send</button>
        </Modal>
    )
}

export default SendERC20