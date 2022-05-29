import { FC } from 'react'
import { APP_NAME } from '@/lib/consts'
import { BookOpenIcon, CodeIcon, ShareIcon } from '@heroicons/react/outline'
import { ConnectButton } from "@rainbow-me/rainbowkit"

const Home: FC = () => {
	return (
		<div className="relative flex items-top justify-center min-h-screen bg-gray-100 dark:bg-gray-900 sm:items-center py-4 sm:pt-0">
		<ConnectButton />	
		</div>
	)
}

export default Home
