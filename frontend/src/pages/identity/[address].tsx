import { useRouter } from "next/router";
import { useAccount, useBalance, useContractRead } from "wagmi";
import { avatarFromAddress } from "../../utils/avatarFromAddress"
import { abi } from "../../utils/Identity.json"
import ERC20s from "@/components/ERC20s";
import NFTs from "@/components/NFTs";
import QuickActions from "@/components/QuickActions";

const Identity = () => {
    const { data } = useAccount();
    const router = useRouter();
    const identityAddress = router.query.address as string;
    const { color, emoji } = avatarFromAddress(identityAddress);

    const { data: bal, isError, isLoading } = useBalance({
        addressOrName: identityAddress,
    })

    const identityConfig = { addressOrName: identityAddress, contractInterface: abi }

    const { data: owners } = useContractRead(identityConfig, "getOwners")
    const { data: isOwner } = useContractRead(identityConfig, "isOwner", { args: [data?.address] });


    return (
        <div className="flex flex-1">
            <div className="w-1/6 flex flex-col justify-start items-center p-10 pt-20">
                <span style={{ backgroundColor: color }} className="text-4xl p-4 rounded-full">{emoji}</span>
                <span className="text-xl mt-4 font-bold">{bal?.formatted} {bal?.symbol}</span>
            </div>
            <div className="flex flex-col flex-1 p-10 pt-20 gap-10">
                <h1 className="text-2xl font-black cursor-pointer" onClick={() => {
                    const el = document.createElement("textarea")
                    el.value = identityAddress
                    el.setAttribute("readonly", "")
                    el.style.position = "absolute"
                    el.style.left = "-9999px"
                    document.body.appendChild(el)
                    el.select()
                    document.execCommand("copy")
                    document.body.removeChild(el)
                    alert("copied")
                }}>
                    {identityAddress ? identityAddress : "Loading..."}</h1>
                <div>
                    <h2 className="subheading mb-5">Owners</h2>
                    {owners?.map(owner => <a target={"_blank"} href={`https://mumbai.polygonscan.com/address/${owner}`} className="mr-1 p-2 rounded bg-gray-900 bg-opacity-10">{owner}</a>)}
                </div>
                <NFTs identityConfig={identityConfig} isOwner={isOwner} />
                <ERC20s identityConfig={identityConfig} isOwner={isOwner} />
                <QuickActions identityConfig={identityConfig} isOwner={isOwner} />
            </div>
        </div>

    )
}

export default Identity