import Nav from "@components/Nav";
import { CHAIN } from "@lib/constants";

import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import merge from 'lodash.merge';

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultWallets, RainbowKitProvider, darkTheme, lightTheme, Theme } from '@rainbow-me/rainbowkit'

import { publicProvider } from 'wagmi/providers/public';
import { createClient, WagmiConfig, configureChains } from 'wagmi'

import { QueryClient, QueryClientProvider } from "react-query";
import { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import Head from "next/head";

const { chains, provider } = configureChains(
	[CHAIN],
	[publicProvider()]
)

const { connectors } = getDefaultWallets({ appName: "Identities", chains })
const wagmiClient = createClient({ autoConnect: true, connectors, provider })
const apolloClient = new QueryClient();

const mydarkTheme = merge(darkTheme(), {
	fonts: {
		body: "inter"
	},
} as Theme);

const mylightTheme = merge(lightTheme(), {
	fonts: {
		body: "inter"
	},
} as Theme);


const App = ({ Component, pageProps }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true)
	}, [])

	return (
		<QueryClientProvider client={apolloClient}>
			<WagmiConfig client={wagmiClient}>
				<RainbowKitProvider showRecentTransactions={true} theme={{
					lightMode: mylightTheme,
					darkMode: mydarkTheme,
				}} chains={chains}>
					<div className="min-h-screen bg-gray-100 bg-opacity-10 flex flex-col overflow-hidden">
						{mounted ? <Toaster /> : null}
						<Head>
							<title>Smart Identities</title>
							<meta name="viewport" content="initial-scale=1.0, width=device-width" />
							<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
							<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
							<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
							<link rel="manifest" href="/site.webmanifest" />
							
							<script async src="https://cdn.splitbee.io/sb.js"></script>
							
						</Head>
						<Nav />
						<Component {...pageProps} />
					</div>
				</RainbowKitProvider>
			</WagmiConfig>
		</QueryClientProvider>

	)
}

export default App
