import { useRouter } from "next/router"
import { useEffect, useState } from "react";
import { useAccount, useBalance } from "wagmi";

import avatarFromAddress from "@utils/avatarFromAddress";

import { useQuery } from "react-query";
import { request } from "graphql-request";

import Link from "next/link";
import Image from "next/image";
import { PlusIcon } from "@heroicons/react/solid";


const endpoint = "https://api.thegraph.com/subgraphs/name/sudhamjayanthi/identities";

const Dashboard = () => {
    const router = useRouter();
    const { data: user } = useAccount();

    const [identities, setIdentities] = useState([]);

    const QUERY = `{
        owners(where : {address : "${user?.address.toLowerCase()}"}) {
            identities
        }
    }`;

    const { data, isLoading, error } = useQuery("identities", () => {
        return request(endpoint, QUERY);
    });

    useEffect(() => {
        if (data?.owners[0]) setIdentities(data.owners[0].identities)
        if (isLoading) console.log("loading identities...")
        if (error) console.log(error)
    }, [data, user])


    useEffect(() => {
        if (!user?.address) {
            router.push("/");
        }
    }, [user?.address]);

    const NoIdentity = () => {
        return (
            <div className="flex flex-col flex-1 justify-center items-center gap-10">
                <Image className="rounded" src="https://c.tenor.com/6qtajk7mWzgAAAAM/funny-dance.gif" width="250" height="200" alt="crying cat" />
                <h1 className="font-bold text-4xl">No identities found</h1>
                <p className="text-gray-600 w-[35%] text-center">Identities are smart contracts that can be owned by multiple addresses to act together as single identity in this anon web3 world ✨</p>
                <Link href={"/create"}>
                    <button className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                        <PlusIcon  className="w-5 h-5"/> Create Identity 
                    </button>
                </Link>
            </div>
        )
    }

    const Identities = () => {
        return (
            <div className="flex flex-1 flex-wrap justify-start items-center content-start pt-20 gap-10 m-auto">
                {identities?.map((address, idx) => {
                    const { color, emoji } = avatarFromAddress(address);
                    const { data: bal } = useBalance({
                        addressOrName: address,
                    })

                    return (
                        <div onClick={() => router.push(`/identity/${address}`)} key={idx} className="cursor-pointer flex items-center p-10 drop-shadow-xl bg-gray-100 rounded-lg gap-10 h-1/4">
                            <div className="flex flex-col">
                                <span className="font-bold text-xl">{address.slice(0, 10)}</span>
                                {bal?.formatted} {bal?.symbol}
                            </div>
                            <span style={{ backgroundColor: color }} className="text-lg grid place-items-center w-10 h-10 rounded-full">{emoji}</span>
                        </div>
                    )
                })}
                <a href="create" className="text-white font-medium drop-shadow-xl bg-blue-600 rounded p-14 flex justify-center">
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