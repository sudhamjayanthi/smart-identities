import { ConnectButton } from "@rainbow-me/rainbowkit"

function Nav() {
    return (
        <div className="flex border-b-2 px-6 py-2 w-screen font-semibold items-center justify-between">
            <h3>Identites</h3>
            <ConnectButton showBalance={false} />
        </div>
    )
}

export default Nav