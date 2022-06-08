import toast from "react-hot-toast";
import { useContractRead } from "wagmi";
import NFT from "./NFT"


function NFTs({ identityConfig }) {

    const { data: nfts } = useContractRead(identityConfig, "getNfts")
    return (
        <div className="flex flex-col gap-5">
            <h2 className="subheading">NFTs</h2>
            <div className="flex gap-10">
                {nfts ? nfts?.map((nft, idx) => <NFT key={idx} nftData={nft} />) : "No nfts found"}
            </div>
        </div>
    )
}

export default NFTs