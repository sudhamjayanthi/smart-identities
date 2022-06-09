import { useAddRecentTransaction } from "@rainbow-me/rainbowkit"
import { ethers } from "ethers"
import { useState } from "react"
import toast from "react-hot-toast"
import { erc20ABI, useSigner } from "wagmi"
import Modal from "../Modal"
import PickToken from "./PickToken"

interface token {
    id: number
    name: string,
    address: string,
    symbol: string,
    logoURI: string,
    decimals: number,
    chainId: number,
}

const SendERC20 = ({ to }) => {

    const [token, setToken] = useState<token>()
    const [amount, setAmount] = useState<number>()

    const { data: signer } = useSigner()
    const addTxn = useAddRecentTransaction();

    const onSend = () => {
        const send = async () => {
            if (token) {
                const contract = new ethers.Contract(token.address, erc20ABI, signer)
                console.log("token : ", token.address)
                try {
                    const txn = await contract.transfer(to, amount)
                    addTxn({
                        hash: txn?.hash,
                        description: 'sending tokens to identity',
                    })
                } catch {
                    toast.error(`Make sure you have enough ${token.symbol}!`)
                }
            } else {
                toast.error("Please select a token!")
            }
        }

        send();
    }

    return (
        <Modal title="Send ERC20" toggleText="send erc20" toggleStyle="btn from-blue-700 to-sky-400 ">
            <div className="flex items-center my-4 border-2 rounded-lg p-2">
                <input onChange={e => setAmount(parseInt(e.target.value))} className="flex-1 text-lg font-bold  outline-none px-2" placeholder="0.0" type="number" />
                <PickToken callback={(token: token) => setToken(token)} />
            </div>
            <button onClick={onSend} className="btn bg-blue-600 w-full font-medium">Send</button>
        </Modal>
    )
}

export default SendERC20