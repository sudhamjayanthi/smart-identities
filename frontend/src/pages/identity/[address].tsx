import { useRouter } from "next/router";
import { useAccount, useBalance, useContractRead, useProvider } from "wagmi";

import Owners from "@components/identity/Owners";
import NFTs from "@components/identity/NFTs";
import ERC20s from "@components/identity/ERC20s";
import QuickActions from "@components/identity/QuickActions";

import SendETH from "@components/identity/SendETH";
import SendERC20 from "@components/identity/SendERC20";
import SendNFT from "@components/identity/SendNFT";

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
        <div className="flex flex-col flex-1 items-center">
            <div className="w-min bg-white bg-opacity-30 backdrop-blur-md rounded-2xl mt-10 flex justify-around items-center gap-10 py-12 px-20">
                <div>
                    <span style={{ backgroundColor: color }} className="fixed w-32 h-32 blur-2xl rounded-full -z-10"></span>
                    <span style={{ backgroundColor: color }} className="text-[72px] grid place-content-center select-none h-32 w-32 rounded-full">{emoji}</span>
                </div>
                <div className="flex flex-col gap-3">
                    <h1 className="text-2xl font-black cursor-pointer mb-2" onClick={() => copyToClipboard(identityAddress)}>
                        {identityAddress ? identityAddress : "Loading..."}
                    </h1>
                    <div>
                        <span className="mr-14 text-gray-300 font-medium">balance</span>
                        <span className="text-xl mt-4 text-gray-200 font-semibold">{bal?.formatted} {bal?.symbol}</span>
                    </div>
                    {!destructed && <>
                        <div className="flex items-end gap-2">
                            <span className="mr-4 text-gray-300 font-medium">send tokens</span>
                            <SendETH to={identityConfig.addressOrName} />
                            <SendERC20 to={identityConfig.addressOrName} />
                            <SendNFT identityConfig={identityConfig} />
                        </div>
                    </>}
                </div>
            </div>

            {/* identity details */}
            <div className="flex flex-col flex-1 p-10 pt-20 gap-10 w-[60%]">
                {destructed ? "This identity has been destructed" : <>
                    <Owners identityConfig={identityConfig} owners={owners} />
                    <ERC20s identityConfig={identityConfig} />
                    <NFTs identityConfig={identityConfig} />
                    <QuickActions identityConfig={identityConfig} isOwner={isOwner} />
                </>
                }
            </div>
        </div>
    )
}

export default Identity 