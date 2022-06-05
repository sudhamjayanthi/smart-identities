import { useContractRead } from "wagmi"
import { EXPLORER } from "@/lib/constants";

const colors = ["#f97316", "#34d399", "#b4eeb4"]

const Owner = ({ identityConfig, address, idx }) => {
    const { data: equity } = useContractRead(identityConfig, "equities", { args: [address] })
    
    return <a
        target={"_blank"}
        href={`${EXPLORER}/address/${address}`}
        className="p-2 font-semibold text-center text-gray"
        style={{ backgroundColor: colors[idx % colors.length], width: `${equity}%` }}>{address.slice(0, 7)}
    </a>
}

export default Owner

