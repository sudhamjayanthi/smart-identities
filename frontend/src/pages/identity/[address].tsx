import Link from "next/link";
import { useRouter } from "next/router";
import { useAccount, useBalance, useContractRead, useContractWrite } from "wagmi";
import { avatarFromAddress } from "../../utils/avatarFromAddress"
import { abi } from "../../utils/Identity.json"

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
    const { data: nfts } = useContractRead(identityConfig, "getNfts")
    const { data: acceptedTokens } = useContractRead(identityConfig, "getAcceptedTokens")
    const { data: isOwner } = useContractRead(identityConfig, "isOwner", { args: [data?.address] });

    const { write: cashout } = useContractWrite(identityConfig, "withdraw");

    console.log(isOwner)


    return (
        <div className="flex flex-1">
            <div className="w-1/6 flex flex-col justify-start items-center p-10 pt-20">
                <span style={{ backgroundColor: color }} className="text-4xl p-4 rounded-full">{emoji}</span>
                <span className="text-xl mt-4 font-bold">{bal?.formatted} {bal?.symbol}</span>

            </div>
            <div className="flex flex-col flex-1 p-10 pt-20 gap-10">
                <h1 className="text-2xl font-black cursor-pointer" onClick={() => alert("copied to clipboard")}>{identityAddress ? identityAddress : "Loading..."}</h1>
                <div>
                    <h2 className="subheading mb-2">Owners</h2>
                    {owners?.map(owner => <span className=" mr-1 p-2 rounded bg-sky-200">{owner}</span>)}
                </div>
                <div>
                    <h2 className="subheading">NFTs</h2>
                    {nfts?.map(nft => nft)}
                    {isOwner && <button className="btn from-orange-500 to-yellow-500">send another</button>}
                </div>
                <div>
                    <h2 className="subheading">Accepted ERC20s</h2>
                    {isOwner && <button className="btn from-blue-700 to-sky-400 ">add another</button>}
                </div>
                <div className="shadow-lg border border-slate-200 p-5 rounded-lg w-[60%] -ml-5">
                    <h2 className="subheading">quick actions</h2>
                    <div className="flex gap-4 mt-4">
                        {isOwner && <button className="btn bg-green-600">💰 cashout</button>}
                        {isOwner && <button className="btn bg-red-600">🗑️ cashout and destruct identity</button>}
                        <Link href={`https://mumbai.polygonscan.com/address/${identityAddress}`}>

                            <a className="btn bg-blue-600">🔍 view on explorer</a>
                        </Link>

                    </div>
                </div>
            </div>
        </div>

    )
}

export default Identity