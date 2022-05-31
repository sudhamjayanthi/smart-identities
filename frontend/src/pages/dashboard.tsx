import Image from "next/image";
import { useRouter } from "next/router"
import { useEffect } from "react";
import { useAccount } from "wagmi";

const Dashboard = () => {
    const router = useRouter();
    const { data } = useAccount();

    useEffect(() => {
        if (!data?.address) {
            router.push("/");
        }
    }, [data])


    return (
        <div className="flex flex-col flex-1 justify-center items-center gap-10">
            <Image className="rounded" src="https://c.tenor.com/6qtajk7mWzgAAAAM/funny-dance.gif" width="250" height="200" alt="crying cat" />
            <h1 className="font-bold text-4xl">Uhoh.. no identites found</h1>
            <p className="text-gray-600 w-1/3 text-center">Identities are smart contracts that can be owned by multiple addresses to act together as single identity in this anon web3 world ✨</p>
            <button onClick={() => router.push("/create")} className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg> create identity
            </button>
        </div>

    )
}

export default Dashboard