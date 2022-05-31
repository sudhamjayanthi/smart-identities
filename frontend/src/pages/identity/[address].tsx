import { useRouter } from "next/router";
import { useAccount } from "wagmi";
import { avatarFromAddress } from "../../utils/avatarFromAddress"

const Identity = () => {
    const { data } = useAccount();

    const router = useRouter();
    const identityAddress = router.query.address as string;

    const getOwners = (address) => {
        return [data?.address]
    }

    const isOwner = getOwners(identityAddress).includes(data?.address);
    const { color, emoji } = avatarFromAddress(identityAddress);
    // const avatarStyle = ` bg-[${color}]`

    return (
        <div className="flex flex-1">
            <div className="w-1/6 flex flex-col justify-start items-center p-10 pt-20">
                <span style={{ backgroundColor: color }} className="text-4xl p-4 rounded-full">{emoji}</span>
            </div>
            <div className="flex-1 p-10 pt-20">
                <h1 className="text-2xl font-black cursor-pointer" onClick={() => alert("copied to clipboard")}>{identityAddress ? identityAddress.slice(0, 20) : "Loading"}...</h1>
                <h2 className="subheading">Owners</h2>
            </div>
        </div>

    )
}

export default Identity