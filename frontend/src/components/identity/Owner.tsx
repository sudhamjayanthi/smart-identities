import { useContractRead } from "wagmi"
import { EXPLORER } from "@lib/constants";

const colors = ["#f7d6e0", "#c3f1fa", "#e5f4e3", "#edf6f9"]

const Owner = ({ identityConfig, address, idx }) => {
    const { data: equity } = useContractRead(identityConfig, "equities", { args: [address] })

    return <a
        target={"_blank"}
        rel={"noopener noreferrer"}
        href={`${EXPLORER}/address/${address}`}
        className="py-2 font-medium text-center text-gray-800 min-w-min text-sm whitespace-nowrap px-4"
        style={{ backgroundColor: colors[idx % colors.length], width: `${equity}%` }}>{address.slice(0, 7)} {equity && `(${equity.toString()}%)`}
    </a>
}

export default Owner

