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
    const [amount, setAmount] = useState<string>()

    const { data: signer } = useSigner()
    const addTxn = useAddRecentTransaction();

    const onSend = () => {
        const send = async () => {
            if (token && amount) {
                const contract = new ethers.Contract(token.address, erc20ABI, signer)
                try {
                    const txn = await contract.transfer(to, ethers.utils.parseUnits(amount, token.decimals))
                    addTxn({
                        hash: txn?.hash,
                        description: 'sending tokens to identity',
                    })
                } catch (e) {
                    console.log(e)
                    toast.error(`Error occured. Make sure you have enough ${token.symbol}!`)
                }
            } else toast.error("Invalid token or amount!")
        }

        send();
    }

    return (
        <Modal title="Send ERC20" toggleText="ERC20" toggleStyle="btn bg-blue-500">
            <div className="flex items-center my-4 border-2 border-gray-700 rounded-lg p-2">
                <input className="flex-1 text-lg font-semibold bg-transparent text-white outline-none px-2" placeholder="0.0" type="number" onChange={e => setAmount(e.target.value)} />
                <PickToken callback={(token: token) => setToken(token)} />
            </div>
            <button className="btn bg-blue-600 w-full font-medium" onClick={onSend}>Send</button>
        </Modal>
    )
}

export default SendERC20