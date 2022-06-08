import SelectSearch, { useSelect } from 'react-select-search';
import { useForm } from "react-hook-form";
import Modal from "../Modal";
import Fuse from "fuse.js";
import { Fragment, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";

const SendERC20 = ({ identityConfig }) => {
    const [value, setValue] = useState("")
    const [showTokenSearch, setShowTokenSearch] = useState(false)

    const [search, setSearch] = useState("")
    const [showOptions, setShowOptions] = useState(false)


    const { register, handleSubmit, formState: { errors } } = useForm();

    const onSubmit = (data) => {

    }


    // koptimism - optimism kovan
    const koptimismTokens = [{ "chainId": 69, "name": "Synthetix", "symbol": "SNX", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/SNX.svg", "extensions": { "optimismBridgeAddress": "0x5b643DFC67f9701929A0b55f23e0Af61df50E75D" }, "value": "0x0064A673267696049938AA47595dD0B3C2e705A1" }, { "chainId": 69, "name": "Dai stable coin", "symbol": "DAI", "decimals": 18, "logoURI": "https://cryptologos.cc/logos/multi-collateral-dai-dai-logo.svg?v=010", "extensions": { "optimismBridgeAddress": "0x467194771dAe2967Aef3ECbEDD3Bf9a310C76C65" }, "value": "0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1" }, { "chainId": 69, "name": "Tether USD", "symbol": "USDT", "decimals": 6, "logoURI": "https://ethereum-optimism.github.io/logos/USDT.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x7F5c764cBc14f9669B88837ca1490cCa17c31607" }, { "chainId": 69, "name": "Wrapped Bitcoin", "symbol": "WBTC", "decimals": 8, "logoURI": "https://ethereum-optimism.github.io/logos/WBTC.svg", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x2382a8f65b9120E554d1836a504808aC864E169d" }, { "chainId": 69, "name": "0xBitcoin", "symbol": "0xBTC", "decimals": 8, "logoURI": "https://ethereum-optimism.github.io/logos/0xBTC.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x56B4F5f44d348EC3F07Bf1f31A3B566E5304BedE" }, { "chainId": 69, "name": "Chainlink", "symbol": "LINK", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/LINK.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x4911b761993b9c8c0d14Ba2d86902AF6B0074F5B" }, { "chainId": 69, "name": "Tether EUR", "symbol": "EURT", "decimals": 6, "logoURI": "https://ethereum-optimism.github.io/logos/USDT.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x65e44970ebFe42f98F83c4B67062DE94B9f3Da7D" }, { "chainId": 69, "name": "Synthetix USD", "symbol": "sUSD", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/sUSD.svg", "value": "0xaA5068dC2B3AADE533d3e52C6eeaadC6a8154c57" }, { "chainId": 69, "name": "USD Coin", "symbol": "USDC", "decimals": 6, "logoURI": "https://ethereum-optimism.github.io/logos/USDC.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x4e62882864fB8CE54AFfcAf8D899A286762B011B" }, { "chainId": 69, "name": "Uniswap", "symbol": "UNI", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/UNI.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x5e31B81eaFba4b9371e77F34d6f3DA8091C3F2a0" }, { "chainId": 69, "name": "Rai Reflex Index", "symbol": "RAI", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/RAI.svg", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x743224e4822710a3e40d754244f3e0f1db2e5d8f" }, { "chainId": 69, "name": "BitANT", "symbol": "BitANT", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/BitANT.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x1f748732AF4442Cf508DEf0882ad9fcB5E5205a2" }, { "chainId": 69, "name": "BitBTC", "symbol": "BitBTC", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/BitBTC.png", "extensions": { "optimismBridgeAddress": "0x0CFb46528a7002a7D8877a5F7a69b9AaF1A9058e" }, "value": "0x83643C9eF0c5707A7815124754d0828c9A38be3a" }, { "chainId": 69, "name": "Perpetual", "symbol": "PERP", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/PERP.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb" }, { "chainId": 69, "name": "BarnBridge Governance Token", "symbol": "BOND", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/BOND.svg", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x9e5AAC1Ba1a2e6aEd6b32689DFcF62A509Ca96f3" }, { "chainId": 69, "name": "dForce", "symbol": "DF", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/DF.svg", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x3e7eF8f50246f725885102E8238CBba33F276747" }, { "chainId": 69, "name": "dForce USD", "symbol": "USX", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/USX.svg", "extensions": { "optimismBridgeAddress": "0xB4d37826b14Cd3CB7257A2A5094507d701fe715f" }, "value": "0xab7020476d814c52629ff2e4cebc7a8cdc04f18e" }, { "chainId": 69, "name": "Dentacoin", "symbol": "DCN", "decimals": 0, "logoURI": "https://ethereum-optimism.github.io/logos/dcn.svg", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0xfd6ab60e0744e95c35fb17afda478eeae3835ddf" }, { "chainId": 69, "name": "Kromatika", "symbol": "KROM", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/KROM.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x9e1028F5F1D5eDE59748FFceE5532509976840E0" }, { "chainId": 69, "name": "Theranos Coin", "symbol": "LIZ", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/LIZ.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x3bb4445d30ac020a84c1b5a8a2c6248ebc9779d0" }, { "chainId": 69, "name": "SPANK", "symbol": "SPANK", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/spank.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0xcfD1D50ce23C46D3Cf6407487B2F8934e96DC8f9" }, { "chainId": 69, "name": "Aave Token", "symbol": "AAVE", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/AAVE.svg", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x76FB31fb4af56892A25e32cFC43De717950c9278" }, { "chainId": 69, "name": "Equalizer", "symbol": "EQZ", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/EQZ.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x8ee73c484a26e0a5df2ee2a4960b789967dd0415" }, { "chainId": 69, "name": "Geyser", "symbol": "GYSR", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/GYSR.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x197D38DC562DfB2490eC1A1d5C4CC4319d178Bb4" }, { "chainId": 69, "name": "Balancer", "symbol": "BAL", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/BAL.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0xc72751efd79B153D5bdC7E1a43b4b98aA2aA04C7" }, { "chainId": 69, "name": "Gitcoin", "symbol": "GTC", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/GTC.svg", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0xaf8ca653fa2772d58f4368b0a71980e9e3ceb888" }, { "chainId": 69, "name": "Optimism", "symbol": "OP", "decimals": 18, "logoURI": "https://ethereum-optimism.github.io/logos/OP.png", "extensions": { "optimismBridgeAddress": "0x4200000000000000000000000000000000000010" }, "value": "0x4200000000000000000000000000000000000042" }]
    const defaultToken = koptimismTokens.filter(token => token.symbol === "USDC")[0]

    const fuzzySearch = (value: string) => {
        const fuse = new Fuse(koptimismTokens, {
            keys: ['name', 'symbol', 'value'],
            threshold: 0.25,
        });

        if (value) {
            return fuse.search(value);
        }

        return koptimismTokens;
    }



    return (
        <div>
            <Modal title="Accept ERC20" toggleText="send erc20" toggleStyle="btn from-blue-700 to-sky-400 ">
                <div className="flex w-full p-2 border-2 rounded-lg mt-4 gap-2">
                    <input className="flex-1 text-lg font-medium border-none outline-none" placeholder="0.0" type="number">
                    </input>
                    {/* <Modal title="" toggleText="Select a token ▼" toggleStyle="btn bg-blue-600">
                    </Modal> */}
                    <>
                        <div >
                            {value ? (<>{koptimismTokens.filter(token => token.value === value).map(token => {
                                <button
                                    onClick={() => setShowTokenSearch(true)}
                                    className="btn bg-blue-600 flex items-center"
                                >
                                    <div key={value.value} className="cursor-pointer flex items-center gap-2 my-2">
                                        <img src={value.logoURI} className="w-8 h-8 rounded-full" />
                                        <span>{value.name}</span>
                                    </div> <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            })}</>) : (<button
                                onClick={() => setShowTokenSearch(true)}
                                className="btn bg-blue-600 flex items-center"
                            >
                                Select a token <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                </svg>
                            </button>)}
                        </div>

                        <Transition appear show={showTokenSearch} as={Fragment}>
                            <Dialog as="div" className="relative z-10" onClose={() => setShowTokenSearch(false)}>
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
                                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all ">
                                                {/* <Dialog.Title
                                                    as="h3"
                                                    className="text-lg font-medium text-gray-900"
                                                >
                                                    {title}
                                                </Dialog.Title> */}
                                                <div>
                                                    {value}
                                                    <input onFocus={() => setShowOptions(true)} onBlur={() => setShowOptions(false)} onChange={(e) => setSearch(e.target.value)} className="border-2" />
                                                    {showOptions && fuzzySearch(search).map(token => {
                                                        return <div key={token.value} onClick={() => { setValue(token.value); setShowTokenSearch(false) }} className="cursor-pointer flex items-center gap-2 my-2">
                                                            <img src={token.logoURI} className="w-8 h-8 rounded-full" />
                                                            <span>{token.name}</span>
                                                        </div>
                                                    })}
                                                </div>
                                            </Dialog.Panel>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>
                    </>

                </div>

                {/* <CustomSelect setValueCallback={setValue} /> */}
                {/* {value} */}
                {/* <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="flex flex-col gap-3 mt-4">
                        <label htmlFor="address">Token Address</label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            className="outline-none border-slate-300 border-2 p-1 rounded-md focus:border-blue-300"
                            {...register("address", { pattern: /^0x[a-fA-F0-9]{40}$/, required: true })}
                        />
                        {errors.address && <span className="text-red-400">{errors.address.message}</span>}
                        <label htmlFor="address">Amount</label>
                        <input
                            type="text"
                            name="address"
                            id="address"
                            className="outline-none border-slate-300 border-2 p-1 rounded-md focus:border-blue-300"
                            {...register("amount", { required: true })}
                        />
                        <button type="submit" className="btn bg-blue-600">Send</button>
                    </div>
                </form> */}
            </Modal>
        </div >
    )
}

export default SendERC20;