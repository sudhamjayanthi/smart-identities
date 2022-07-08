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
		<div className="flex flex-col gap-10 flex-1 justify-center items-center">
			<h1 className="text-4xl font-bold">Log In 🔒</h1>
			<p className="text-gray-400">Please connect your wallet to get started!</p>
			<ConnectButton />
		</div>
	)
}

export default Home
