import '../styles/globals.css'
import 'tailwindcss/tailwind.css'
import '@rainbow-me/rainbowkit/styles.css'

import { publicProvider } from 'wagmi/providers/public';
import { chain, createClient, WagmiConfig, configureChains } from 'wagmi'
import { getDefaultWallets, RainbowKitProvider, darkTheme, lightTheme } from '@rainbow-me/rainbowkit'
import Nav from "@components/Nav";

const { chains, provider } = configureChains(
	[chain.polygonMumbai],
	[publicProvider()]
)

const { connectors } = getDefaultWallets({ appName: "Identities", chains })
const wagmiClient = createClient({ autoConnect: true, connectors, provider })

const App = ({ Component, pageProps }) => {
	return (
		<WagmiConfig client={wagmiClient}>
			<RainbowKitProvider showRecentTransactions={true} theme={{
				lightMode: lightTheme(),
				darkMode: darkTheme(),
			}} chains={chains}>
				{/* <div className="bg-gray-100 dark:bg-gray-900 border-b-[1px] dark:text-gray-100 h-screen flex font-sans"> */}
				<div className="min-h-screen bg-gray-100 flex flex-col overflow-hidden font-[inter]">
					<Nav />
					<Component {...pageProps} />
				</div>
			</RainbowKitProvider>
		</WagmiConfig>
	)
}

export default App