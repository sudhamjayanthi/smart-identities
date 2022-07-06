import ERC20 from "./ERC20";
import { useContractRead } from "wagmi";

function ERC20s({ identityConfig }) {

    const { data: acceptedTokens } = useContractRead(identityConfig, "getAcceptedTokens")

    return (
        <div className="flex flex-col">
            <h2 className="subheading">ERC20s</h2>
            <div>
                {acceptedTokens?.length !== 0 ? acceptedTokens?.map(token => <ERC20 key={token} address={token} identity={identityConfig.addressOrName} />) : <span className="text-gray-400">No tokens accepted. Accept tokens to see their balances here!</span>}
            </div>
        </div>
    )
}

export default ERC20s