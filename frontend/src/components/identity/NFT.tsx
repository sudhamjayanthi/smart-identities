import { useEffect, useState } from "react"
import { erc721ABI, useBlockNumber, useContractRead } from "wagmi"

const NFT = ({ nftData: [sentBy, collection, tokenId, sentAt] }) => {
    const [imageURL, setImageURL] = useState(null)
    const { data : block } = useBlockNumber()

    const { data: tokenURI, isLoading } = useContractRead({
        addressOrName: collection,
        contractInterface: erc721ABI
    }, "tokenURI", { args: [tokenId] })

    const since = block && block - sentAt
    
    useEffect(() => {
        if (!isLoading) {
            if (tokenURI.includes("https://")) {
                fetch(tokenURI.toString()).then(res => res.json()).then(data => setImageURL(data.image))
            } else {
                try {
                    const json = atob(tokenURI.toString().substring(29));
                    const metadata = JSON.parse(json);
                    const svg = atob(metadata.image.substring(26));
                    const blob = new Blob([svg], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    setImageURL(url)
                    console.log(url)
                } catch (e) {
                    console.log(e)
                }
            }

        }
    }, [tokenURI])


    return (
        <div className="flex flex-col items-center gap-2">
            <img className="w-60 rounded-lg" src={imageURL} onLoad={() => URL.revokeObjectURL(imageURL)} />
            <span className="text-sm">
                Since {since && since} blocks
            </span>
        </div>
    )

}
export default NFT
