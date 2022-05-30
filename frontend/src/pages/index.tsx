import { FC, useEffect } from 'react'
import { ConnectButton } from "@rainbow-me/rainbowkit"
import { useAccount } from "wagmi"
import { useRouter } from "next/router";

const Home: FC = () => {
	const { data } = useAccount();
	const router = useRouter();

	useEffect(() => {
		if (data?.address) {
			router.push("/dashboard");
		}
	}, [data])

	return (
		<div className="flex justify-center items-center">
			<ConnectButton />
		</div>
	)
}

export default Home
