import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";

import { useQuery } from "react-query";
import { request } from "graphql-request";

import Link from "next/link";
import { PlusIcon } from "@heroicons/react/solid";

import avatarFromAddress from "@utils/avatarFromAddress";

const endpoint = "https://api.thegraph.com/subgraphs/name/sudhamjayanthi/identities";

const Dashboard = () => {
    const router = useRouter();
    const { data: user } = useAccount();

    const [identities, setIdentities] = useState([]);

    const query = `{
        owners(where : {address : "${user?.address.toLowerCase()}"}) {
            identities
        }
    }`;

    const { data, isLoading, error } = useQuery("identities", () => {
        return request(endpoint, query);
    });

    useEffect(() => {
        if (!user?.address) {
            router.push("/");
        }
    }, [user?.address]);

    useEffect(() => {
        if (data?.owners[0]) setIdentities(data.owners[0].identities)
        if (isLoading) console.log("loading identities...")
        if (error) console.log(error)
    }, [data])

    const NoIdentity = () => {
        return (
            <div className="flex flex-col flex-1 justify-center items-center gap-10">
                <h1 className="font-bold text-4xl">No identities found</h1>
                <p className="text-gray-400 w-[35%] text-center">Identities are smart contracts that can be owned by multiple addresses to act together as single identity in this anon web3 world ✨</p>
                <Link href={"/create"}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <PlusIcon className="w-5 h-5" /> CREATE IDENTITY
                    </button>
                </Link>
            </div>
        )
    }

    const Identities = () => {
        return (
            <div className="flex flex-1 flex-wrap justify-start items-center content-start pt-20 gap-10 m-auto ">
                {identities?.map((address, idx) => {
                    const { color, emoji } = avatarFromAddress(address);
                    const { data: bal } = useBalance({
                        addressOrName: address,
                    })

                    return (
                        <div onClick={() => router.push(`/identity/${address}`)} key={idx} className="card cursor-pointer flex items-center py-10 px-11 drop-shadow-xl bg-white bg-opacity-50 backdrop-blur-xl  text-black rounded-lg gap-10 h-1/4">
                            {/* <span className="bg-blue-400 blur-xl fixed left-2 top-2 -z-10 w-1/2 h-1/3 rounded-full bg-opacity-60"></span> */}
                            <div className="flex flex-col">
                                <span className="font-bold text-xl">{address.slice(0, 10)}</span>
                                <span className="mt-2 font-medium text-gray-800">
                                    {bal?.formatted} {bal?.symbol}
                                </span>
                            </div>
                            <span style={{ backgroundColor: color }} className="text-3xl grid place-items-center w-16 h-16 rounded-full">{emoji}</span>
                        </div>
                    )
                })}
                <a href="create" className="text-white font-medium drop-shadow-xl bg-blue-500 rounded-lg p-14 px-24 flex justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                    </svg>
                </a>
            </div>
        )
    }

    return (
        identities.length !== 0 ? <Identities /> : <NoIdentity />
    )
}

export default Dashboard