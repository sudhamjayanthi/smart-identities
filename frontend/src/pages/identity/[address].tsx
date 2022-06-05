import { useRouter } from "next/router";
import { useAccount, useBalance, useContractRead } from "wagmi";
import { avatarFromAddress } from "../../utils/avatarFromAddress"
import Owner from "@components/Owner";
import ERC20s from "@components/ERC20s";
import NFTs from "@components/NFTs";
import QuickActions from "@components/QuickActions";

import IdentityABI from "@/utils/Identity.json"
import copyToClipboard from "@/utils/copyToClipboard";

const Identity = () => {
    const { data } = useAccount();
    const router = useRouter();
    const identityAddress = router.query.address as string;
    const { color, emoji } = avatarFromAddress(identityAddress);

    const { data: bal } = useBalance({
        addressOrName: identityAddress,
    })

    const identityConfig = { addressOrName: identityAddress, contractInterface: IdentityABI.abi }

    const { data: owners } = useContractRead(identityConfig, "getOwners")
    const { data: isOwner } = useContractRead(identityConfig, "isOwner", { args: [data?.address] });

    return (
        <div className="flex flex-1">
            <div className="w-1/6 flex flex-col justify-start items-center p-10 pt-20">
                <span style={{ backgroundColor: color }} className="text-4xl grid place-content-center select-none h-20 w-20 rounded-full">{emoji}</span>
                <span className="text-xl mt-4 font-bold">{bal?.formatted} {bal?.symbol}</span>
            </div>
            <div className="flex flex-col flex-1 p-10 pt-20 gap-10">
                <h1 className="text-2xl font-black cursor-pointer" onClick={() => copyToClipboard(identityAddress)}>
                    {identityAddress ? identityAddress : "Loading..."}
                </h1>
                <div>
                    <h2 className="subheading mb-5">Owners</h2>
                    <div className="w-[65%] flex rounded overflow-hidden shadow-[9px_9px_45px_-17px_rgba(0,0,0,0.75)]">
                        {owners?.map((address, idx) => {
                            return <Owner address={address} key={idx} idx={idx} identityConfig={identityConfig} />
                        })}
                    </div>
                </div>
                <NFTs identityConfig={identityConfig} isOwner={isOwner} />
                <ERC20s identityConfig={identityConfig} isOwner={isOwner} />
                <QuickActions identityConfig={identityConfig} isOwner={isOwner} />
            </div>
        </div>

    )
}

export default Identity 