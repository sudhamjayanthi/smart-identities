import Nav from "@components/Nav";
import { CHAIN } from "@lib/constants";

import '../styles/globals.css'
import 'tailwindcss/tailwind.css'

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'

import { publicProvider } from 'wagmi/providers/public';
import { createClient, WagmiConfig, configureChains } from 'wagmi'

import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";

const { chains, provider } = configureChains(
	[CHAIN],
	[publicProvider()]
)

const { connectors } = getDefaultWallets({ appName: "Identities", chains })
const wagmiClient = createClient({ autoConnect: true, connectors, provider })
const apolloClient = new QueryClient();

const App = ({ Component, pageProps }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<QueryClientProvider client={apolloClient}>
			<WagmiConfig client={wagmiClient}>
				<RainbowKitProvider showRecentTransactions={true} theme={{
					lightMode: lightTheme(),
					darkMode: darkTheme(),
				}} chains={chains}>
					<div className="min-h-screen bg-gray-100 bg-opacity-10 flex flex-col overflow-hidden">
						{mounted ? <Toaster /> : null}
						<Nav />
						<Component {...pageProps} />
					</div>
				</RainbowKitProvider>
			</WagmiConfig>
		</QueryClientProvider>

	)
}

export default App