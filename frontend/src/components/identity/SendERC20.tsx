import Modal from "../Modal";
import tokens from "@lib/tokens";

import Fuse from "fuse.js";
import { Fragment, useState } from "react";
import { Combobox } from '@headlessui/react'
import { Dialog, Transition } from "@headlessui/react";

interface token {
    chainId: number,
    name: string,
    symbol: string,
    decimals: number,
    logoURI: string,
    address: string,
    id: number
}

const SendERC20 = () => {
    const [search, setSearch] = useState(null)
    const [tokenIdx, setTokenIdx] = useState(null)
    const [showSearchModal, setShowSearchModal] = useState(false)

    const token = tokens[tokenIdx]

    const fuzzySearch = (value: string) => {
        const fuse = new Fuse(tokens, {
            keys: ['name', 'symbol', 'value'],
            threshold: 0.25,
        });

        if (value) {
            return fuse.search(value);
        }

        return tokens;
    }

    const searchResults = fuzzySearch(search)

    return (
        <div>
            <div className="w-full flex justify-center">
                <button
                    onClick={() => setShowSearchModal(true)}
                    className={`flex items-center font-medium py-2 px-3 rounded-lg ${tokenIdx !== null ? "bg-gray-100" : " bg-blue-600 text-white whitespace-nowrap"}`}
                >
                    {tokenIdx !== null ? <div key={token.id} className="cursor-pointer flex items-center gap-2 my-2 text-black font-medium">
                        <img src={token.logoURI} className="w-5 h-5 rounded-full" />
                        <span>{token.symbol}</span>
                    </div> : <span>Select Token</span>}
                    <svg xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${tokenIdx !== null ? "text-black" : "text-white"}`} viewBox="0 0 20 20" fill="currentColor">
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
                                    <Dialog.Panel className="w-full max-w-md transform rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                                        <Dialog.Title
                                            as="h3"
                                            className="text-lg font-medium text-gray-900 mb-4"
                                        >
                                            Select a token
                                        </Dialog.Title>

                                        <Combobox value={tokenIdx} onChange={(id) => { setTokenIdx(id); setShowSearchModal(false) }} >
                                            <Combobox.Input placeholder="Search for a token" className="border-2 w-full rounded-lg outline-none p-2" onChange={(event) => setSearch(event.target.value)} />
                                            {/* <Combobox.Options className="absolute mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"> */}
                                            <Combobox.Options className="mt-2 h-[40vh] overflow-auto ">
                                                {searchResults.length === 0 && search !== '' ? (
                                                    <div className="text-center mt-4 text-gray-700">
                                                        No tokens found.
                                                    </div>
                                                ) : searchResults.map(token => {
                                                    return (
                                                        <>
                                                            <Combobox.Option className={({ active }) => `flex items-center gap-2 p-4 cursor-pointer rounded-lg ${active ? 'bg-gray-200' : 'text-gray-900'}`} key={token.id} value={token.id}>
                                                                {/* <div className="" onClick={() => { setTokenIdx(token.id); setShowSearchModal(false) }}> */}
                                                                    <img src={token.logoURI} className="w-8 h-8 rounded-full" />
                                                                    <div className="flex flex-col">
                                                                        <span className="font-medium">{token.name}</span>
                                                                        <span className="text-sm text-gray-600">{token.address.slice(0, 33)}...</span>
                                                                    </div>
                                                                {/* </div> */}
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
            </div>
            {/* <input className="border-2 text-lg font-bold  outline-none rounded-lg p-2" placeholder="0.0" type="number" /> */}
        </div>


    )
}
export default SendERC20;