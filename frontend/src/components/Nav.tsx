import Link from "next/link"
import { ConnectButton } from "@rainbow-me/rainbowkit"

function Nav() {
    return (
        <div className="flex px-10 py-6 w-screen font-medium items-center justify-between">
            <Link href={"/"}><h1 className="cursor-pointer ">identites</h1></Link>
            <div className="flex items-center gap-6 text-gray-300">
                <a target="_blank" href="https://docs.smart-identities.ml">Guide</a>
                <a>Github</a>
                <a>Discord</a>
                <ConnectButton />
            </div>
        </div>
    )
}

export default Nav