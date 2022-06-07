import { useEffect, useState } from "react"
import { erc721ABI, useContractRead } from "wagmi"

const NFT = ({ nftData: [sentBy, collection, tokenId, sentAt] }) => {
    const [imageURL, setImageURL] = useState(null)

    const { data: tokenURI, isLoading } = useContractRead({
        addressOrName: collection,
        contractInterface: erc721ABI
    }, "tokenURI", { args: [tokenId] })

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
        <img className="w-1/5" src={imageURL} onLoad={() => URL.revokeObjectURL(imageURL)} />
    )

}
export default NFT
