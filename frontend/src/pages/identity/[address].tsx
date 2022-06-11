import { useRouter } from "next/router";
import { useAccount, useBalance, useContractRead, useProvider } from "wagmi";

import Owners from "@components/identity/Owners";
import NFTs from "@components/identity/NFTs";
import ERC20s from "@components/identity/ERC20s";
import QuickActions from "@components/identity/QuickActions";

import SendNFT from "@components/identity/SendNFT";
import SendERC20 from "@components/identity/SendERC20";

import IdentityABI from "@utils/Identity.json"
import avatarFromAddress from "@utils/avatarFromAddress"
import copyToClipboard from "@utils/copyToClipboard";
import { useEffect, useState } from "react";


const Identity = () => {
    const { data } = useAccount();
    const provider = useProvider();

    const [destructed, setDestructed] = useState(false);

    const router = useRouter();
    const identityAddress = router.query.address as string;

    const { color, emoji } = avatarFromAddress(identityAddress);
    const { data: bal } = useBalance({
        addressOrName: identityAddress,
    })

    const identityConfig = { addressOrName: identityAddress, contractInterface: IdentityABI.abi }
    const { data: owners } = useContractRead(identityConfig, "getOwners")
    const { data: isOwner } = useContractRead(identityConfig, "isOwner", { args: [data?.address] });

    useEffect(() => {
        const checkIfDestructed = async () => {
            try {
                const code = await provider.getCode(identityAddress)
                setDestructed(code === "0x")
            } catch (e) {

            }
        }
        checkIfDestructed()
    }, [identityAddress])

    return (
        <div className="flex flex-1">
            <div className="w-1/6 flex flex-col justify-start items-center gap-5 p-10 pt-20">
                {/* avatar */} <span style={{ backgroundColor: color }} className="text-4xl grid place-content-center select-none h-20 w-20 rounded-full">{emoji}</span>
                {/* balance */} <span className="text-xl mt-4 font-bold">{bal?.formatted} {bal?.symbol}</span>
                {!destructed && <>
                    <SendNFT identityConfig={identityConfig} />
                    <SendERC20 to={identityConfig.addressOrName} />
                </>}
            </div>

            {/* identity details */}
            <div className="flex flex-col flex-1 p-10 pt-20 gap-10">
                <h1 className="text-2xl font-black cursor-pointer" onClick={() => copyToClipboard(identityAddress)}>
                    {identityAddress ? identityAddress : "Loading..."}
                </h1>
                {destructed ? "This identity has been destructed" : <>
                    <Owners identityConfig={identityConfig} owners={owners} />
                    <NFTs identityConfig={identityConfig} />
                    <ERC20s identityConfig={identityConfig} isOwner={isOwner} />
                    <QuickActions identityConfig={identityConfig} isOwner={isOwner} />
                </>
                }
            </div>
        </div >

    )
}

export default Identity 