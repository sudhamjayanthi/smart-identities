import { useContractRead } from "wagmi";
import NFT from "./NFT"


function NFTs({ identityConfig }) {

    const { data: nfts } = useContractRead(identityConfig, "getNfts")

    return (
        <div className="flex flex-col">
            <h2 className="subheading">NFTs</h2>
            <div className="flex gap-10">
                {nfts?.length !== 0 ? nfts?.map((nft, idx) => <NFT key={idx} nftData={nft} />) : <span className="text-gray-400">No nfts found. Send one to see it here!</span>}
            </div>
        </div>
    )
}

export default NFTs