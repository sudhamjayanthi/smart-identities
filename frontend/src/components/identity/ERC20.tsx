import { ethers } from "ethers"
import { useEffect, useState } from "react"
import { erc20ABI, useSigner, useToken } from "wagmi"

import { EXPLORER } from "@lib/constants"

const Token = ({ address, identity }) => {
    const { data: signer } = useSigner()
    const { data: token } = useToken({ address: address })

    const [balance, setBalance]: [number, Function] = useState()

    useEffect(() => {
        const getBal = async () => {
            let bal = 0;
            if (token) {
                try {
                    const contract = new ethers.Contract(token.address, erc20ABI, signer)
                    bal = await contract.balanceOf(identity) // validates if the given address is a erc20 contract
                    setBalance(bal)
                } catch (e) {
                    console.log(e)
                }
            }
        }

        getBal()

    }, [token, identity, signer])

    return (
        <>
            {token?.symbol && <a href={`${EXPLORER}/token/${token?.address}`} className="mr-2 py-2 px-5 rounded-md border-[1px] border-gray-600">
                {balance && balance / 10 ** token?.decimals} {token?.symbol}
            </a>}
        </>
    )
}

export default Token