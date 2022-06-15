import Link from "next/link"
import { useAccount } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit"

function Nav() {
    const { data: user } = useAccount();

    return (
        <div className="flex px-6 py-4 w-screen font-semibold items-center justify-between bg-white bg-opacity-90">
            <Link href={"/"}><h1 className="cursor-pointer">Smart Identites</h1></Link>
            {user?.address && <ConnectButton />}
        </div>
    )
}

export default Nav