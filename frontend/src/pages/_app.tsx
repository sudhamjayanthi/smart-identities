import { useEffect, useState } from "react";

import Head from "next/head";
import Script from "next/script";

import Nav from "@components/Nav";
import FeedbackWidget from "@components/FeedbackWidget";

import merge from 'lodash.merge';
import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import '@rainbow-me/rainbowkit/styles.css'

import { CHAIN } from "@lib/constants";
import { publicProvider } from 'wagmi/providers/public';
import { createClient, WagmiConfig, configureChains } from 'wagmi'
import { getDefaultWallets, RainbowKitProvider, darkTheme, lightTheme, Theme } from '@rainbow-me/rainbowkit'

import { Toaster } from "react-hot-toast";


import { QueryClient, QueryClientProvider } from "react-query";

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
		if (typeof window !== undefined) setMounted(true)
	}, [])

	return (
		<QueryClientProvider client={apolloClient}>
			<WagmiConfig client={wagmiClient}>
				<RainbowKitProvider showRecentTransactions={true} theme={{
					lightMode: mylightTheme,
					darkMode: mydarkTheme,
				}} chains={chains}>
					<div className="min-h-screen  text-white flex flex-col overflow-hidden">
						<Head>
							<title>Smart Identities</title>
							<meta name="viewport" content="initial-scale=1.0, width=device-width" />
							<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
							<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
							<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
							<link rel="manifest" href="/site.webmanifest" />
							<Script async src="https://cdn.splitbee.io/sb.js"></Script>
						</Head>

						{mounted ? <><Toaster /><FeedbackWidget /></> : null}

						<Nav />

						<Component {...pageProps} />

					</div>
				</RainbowKitProvider>
			</WagmiConfig>
		</QueryClientProvider >
	)
}

export default App
