import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { erc20ABI, useSigner, useToken } from "wagmi"

const Token = ({ address, identity }) => {
    const { data: signer } = useSigner()
    const { data: token, isError, isLoading } = useToken({ address: address })

    const [balance, setBalance] = useState()

    useEffect(() => {
        const getBal = async () => {
            const bal = 0;
            if (token) {
                    try {
                        const contract = new ethers.Contract(token.address, erc20ABI, signer)
                        const bal = await contract.balanceOf(identity) // validates if the given address is a erc20 contract
                        setBalance(bal.toString())
                    } catch (e) {
                        console.log(e)
                    }
            }
        }

        getBal()

    }, [token])

    console.log(balance, token?.decimals)

    return (
        <>
            {token?.symbol && <a href={`https://mumbai.polygonscan.com/token/${token?.address}`} className="mr-2 p-3 px-4 rounded-md bg-gray-900 bg-opacity-10">
                {token?.symbol} {balance && `(bal : ${balance / 10 ** token?.decimals})`}
            </a>}
        </>
    )
}

export default Token