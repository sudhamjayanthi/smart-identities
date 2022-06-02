import { useEffect, useState } from "react"
import { erc721ABI, useContractRead } from "wagmi"

const NFT = ({ nftData: [sentBy, collection, tokenId, sentAt] }) => {
    const [imageURL, setImageURL] = useState(null)
    // const [name, setName] = useState(null)

    const { data: tokenURI } = useContractRead({
        addressOrName: collection,
        contractInterface: erc721ABI
    }, "tokenURI", { args: [tokenId] })

    useEffect(() => {
        const json = atob(tokenURI.toString().substring(29));
        const metadata = JSON.parse(json);
        const svg = atob(metadata.image.substring(26));
        // setName(metadata.name)
        const blob = new Blob([svg], { type: 'image/svg+xml' });
        const url = URL.createObjectURL(blob);
        setImageURL(url)

        console.log(url)
    }, [])


    return (
        // <span className="flex  flex-col items-center">
            <img className="w-1/5" src={imageURL} onLoad={() => URL.revokeObjectURL(imageURL)} />
            // {name} 
        // </span>
    )

}
export default NFT
