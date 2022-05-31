import { ConnectButton } from "@rainbow-me/rainbowkit"
import Link from "next/link"

function Nav() {
    return (
        <div className="flex border-b-2 px-6 py-2 w-screen font-semibold items-center justify-between">
            <Link href={"/"}><h3 className="cursor-pointer">Identites</h3></Link>
            <ConnectButton showBalance={false} />
        </div>
    )
}

export default Nav