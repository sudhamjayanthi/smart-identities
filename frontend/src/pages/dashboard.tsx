import { useRouter } from "next/router"

const Dashboard = () => {
    const router = useRouter();

    return (
        <div className="flex flex-col flex-1 justify-center items-center gap-10">
            <h1 className="font-bold text-4xl">No identites found 😕</h1>
            <p className="text-gray-600">Create one to get started. Identities are smart contracts that can be formed by <br /> multiple addresses to act together as single identity in this anon web3 world.</p>
            <button onClick={() => router.push("/create")} className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg> Create Identity
            </button>
        </div>

    )
}

export default Dashboard