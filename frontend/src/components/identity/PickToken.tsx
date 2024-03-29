import tokens from "@lib/tokens";

import Fuse from "fuse.js";

import { Fragment, useEffect, useState } from "react";
import { Combobox } from '@headlessui/react'
import { Dialog, Transition } from "@headlessui/react";
import { erc20ABI, useNetwork, useSigner } from "wagmi";
import { ethers } from "ethers";
import toast from "react-hot-toast";

interface token {
    chainId: number,
    name: string,
    symbol: string,
    decimals: number,
    logoURI: string,
    address: string,
    id: number
}

const SendERC20 = ({ callback }) => {
    const { data: signer } = useSigner()
    const { activeChain } = useNetwork()

    const [search, setSearch] = useState(null)
    const [tokenIdx, setTokenIdx] = useState(null)
    const [showSearchModal, setShowSearchModal] = useState(false)
    const [customToken, setCustomToken] = useState<token>()

    const token = customToken || tokens[tokenIdx]

    const fuzzySearch = (value: string) => {
        const fuse = new Fuse(tokens, {
            keys: ['name', 'symbol', 'address'],
            threshold: 0.25,
        });

        if (value) {
            return fuse.search(value).map(({ item }) => item);
        }

        return tokens;
    }

    const searchResults = fuzzySearch(search)

    useEffect(() => {
        setCustomToken(null)
        if (searchResults.length === 0 && search.match(/^0x[a-fA-F0-9]{40}$/)) {
            const getTokenDetails = async () => {
                try {
                    const token = new ethers.Contract(search, erc20ABI, signer)
                    const id = tokens.length // ids start from zero
                    const name = await token.name()
                    const symbol = await token.symbol()
                    const decimals = await token.decimals()

                    const _customToken = {
                        id,
                        chainId: activeChain?.id,
                        name,
                        symbol,
                        decimals,
                        logoURI: "https://i.imgur.com/vCeDVgq.png",
                        address: search,
                    }

                    console.log(_customToken)
                    setCustomToken(_customToken)

                } catch (e) {
                    console.log(e)
                    toast.error("Failed to fetch token details!")
                }
            }

            getTokenDetails()
        }
    }, [search])


    return (
        <div className="flex justify-center">
            <button
                onClick={() => setShowSearchModal(true)}
                className={`flex items-center font-medium py-2 px-3 rounded-lg w-max justify-around text-white outline-none ${token ? "bg-gray-100 bg-opacity-10 drop-shadow-xl" : " bg-blue-600  whitespace-nowrap"}`}
            >
                {token ? <div className="cursor-pointer flex items-center gap-2 my-2 font-medium">
                    <img src={token.logoURI} className="w-5 h-5 rounded-full" />
                    <span>{token.symbol}</span>
                </div> : <span>Select a token</span>}
                <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5`} viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
            </button>
            <Transition appear show={showSearchModal} as={Fragment}>
                <Dialog as="div" className="relative z-20" onClose={() => setShowSearchModal(false)}>
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-25" />
                    </Transition.Child>

                    <div className="fixed inset-0 overflow-y-auto">
                        <div className="flex min-h-full items-center justify-center p-4 text-center">
                            <Transition.Child
                                as={Fragment}
                                enter="ease-out duration-300"
                                enterFrom="opacity-0 scale-95"
                                enterTo="opacity-100 scale-100"
                                leave="ease-in duration-200"
                                leaveFrom="opacity-100 scale-100"
                                leaveTo="opacity-0 scale-95"
                            >
                                <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium text-white mb-4"
                                    >
                                        Select a token
                                    </Dialog.Title>

                                    <Combobox value={tokenIdx} onChange={(id) => { setTokenIdx(id); setShowSearchModal(false); callback(tokens[id]); }} >
                                        <Combobox.Input placeholder="Search for a token" className="border-2 border-gray-700 text-gray-200 w-full rounded-lg outline-none p-2 bg-transparent" onChange={(event) => setSearch(event.target.value)} />
                                        <Combobox.Options className="mt-2 h-[40vh] overflow-auto">
                                            {searchResults.length === 0 && search !== "" ? (
                                                <div className="w-full">
                                                    {customToken ? <div className="flex items-center cursor-pointer rounded-lg justify-between bg-gray-700">
                                                        <div className="flex items-center gap-4 p-4">
                                                            <img src={customToken.logoURI} className="w-8 h-8 rounded-full" />
                                                            <div className="flex flex-col">
                                                                <span className="font-medium text-white">{customToken.symbol}</span>
                                                                <span className="text-sm text-gray-300">{customToken.name}</span>
                                                            </div>
                                                        </div>
                                                        <button className="p-1 px-3 mr-4 text-white bg-blue-600 rounded-lg" onClick={() => { callback(customToken); setShowSearchModal(false) }}>add</button>
                                                    </div> : <div className="text-center mt-4 text-gray-500">No tokens found. Paste address to import custom tokens.</div>}

                                                </div>
                                            ) : searchResults.map((token : token) => {
                                                return (
                                                    <>
                                                        <Combobox.Option className={({ active }) => `flex items-center gap-5 p-4 cursor-pointer rounded-lg text-gray-200 ${active && 'bg-gray-700'}`} key={token.address} value={token.id}>
                                                            <img src={token.logoURI} className="w-8 h-8 rounded-full" />
                                                            <div className="flex flex-col">
                                                                <span className="font-medium">{token.symbol}</span>
                                                                <span className="text-sm text-gray-500">{token.name}</span>
                                                            </div>
                                                        </Combobox.Option>
                                                    </>
                                                )
                                            })}
                                        </Combobox.Options>
                                    </Combobox>
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </div >
    )
}
export default SendERC20;