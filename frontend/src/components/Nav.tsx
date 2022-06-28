import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"

function Nav() {
    return (
        <div className="flex px-6 py-4 w-screen font-semibold items-center justify-between bg-white bg-opacity-90">
            <Link href={"/"}><h1 className="cursor-pointer">Smart Identites</h1></Link>
            <ConnectButton />
        </div>
    )
}

export default Nav