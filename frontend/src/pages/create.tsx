import { useForm } from "react-hook-form";

import { useRouter } from "next/router";
import { useEffect, useState } from "react"

import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useAccount, useContractWrite, useContractEvent } from "wagmi";

import Modal from "@components/Modal"
import IdentityFactoryABI from "@/utils/IdentityFactory.json";
import { EXPLORER, FACTORY_ADDRESS } from "@/lib/constants";

import toast from "react-hot-toast";
import { PlusSmIcon } from "@heroicons/react/outline";

const Create = () => {
    const router = useRouter();
    const { data } = useAccount();

    const addTxn = useAddRecentTransaction();

    const [owners, setOwners] = useState([]);
    const { register, handleSubmit, watch, formState: { errors }, reset: resetForm } = useForm();

    const identityFactoryConfig = {
        addressOrName: FACTORY_ADDRESS,
        contractInterface: IdentityFactoryABI.abi,
    }

    const { data: txData, write } = useContractWrite(
        identityFactoryConfig,
        'createIdentity'
    )

    useEffect(() => {
        if (!data?.address) {
            router.push("/");
        }
    }, [data])

    useEffect(() => {
        if (txData?.hash) {
            console.log(`creating identity, txn : ${EXPLORER}/tx/${txData?.hash}`)
            addTxn({
                hash: txData?.hash,
                description: 'created identity',
            })
        }
    }, [txData])

    useContractEvent(identityFactoryConfig, 'NewIdentity', (event) => {
        if (event[0]) {
            console.log(`created identity successfully with address ${event[0]}`)
            router.push(`/identity/${event[0]}`)
        }

    }, { once: true })


    const deleteOwner = (index: number) => {
        const arr = [...owners]
        arr.splice(index, 1)
        setOwners(arr)
    }

    const onSubmit = (data) => {
        setOwners([...owners, data])
        resetForm()
    };

    const createIdentity = () => {
        const addresses = owners.map(owner => owner.address);
        const equities = owners.map(owner => parseInt(owner.equity));

        const duplicateAddress = addresses.some((address) => {
            return addresses.indexOf(address) !== addresses.lastIndexOf(address); // checks for multiple instances of same address
        })

        if (duplicateAddress) {
            console.log("list of addresses : ", addresses)
            toast.error("all the owners should be unique")
            return
        }

        const equitiesSum = equities.reduce((a, b) => a + b, 0)

        if (equitiesSum !== 100) {
            console.log("sum of equities : ", equitiesSum)
            toast.error("equities should add up to 100 %")
            return
        }

        console.log("no validation errors")

        write({
            args: [addresses, equities]
        });

    }

    return (
        <div className="flex p-20 flex-1 items-center gap-10">
            <div>
                <h1 className="text-4xl font-bold mb-20">Create Identity</h1>
                <div className="flex justify-between">
                    <h2 className="text-3xl font-semibold text-gray-200">Owners</h2>
                    <button className="bg-green-600 rounded-lg px-2"><PlusSmIcon className="w-6 h-6" /></button>
                </div>
                <form className="flex items-center gap-2 py-4" onSubmit={handleSubmit(onSubmit)}>
                    <input placeholder="Wallet Address" className="border-slate-600 border-[1px] bg-transparent rounded px-2 py-1 outline-none " {...register("address", { required: true, pattern: /^0x[a-fA-F0-9]{40}$/ })} type="string" defaultValue={owners.length === 0 ? data?.address : ""} />
                    {errors.address && <span className="text-red-400">Please enter a valid address</span>}
                    <input placeholder="Equity %" className="border-slate-600 border-[1px] bg-transparent rounded px-2 py-1 outline-none " {...register("equity", { required: true, min: 1, max: 100 })} type="number" />
                    {errors.equity && <span className="text-red-400">Equity should be a number between 0-100</span>}
                    {/* <label htmlFor="equity" className="text-gray-800 font-medium">Equity - </label> */}
                    {/* <span className="text-gray-600">{watch("equity") || 5}%</span><br /> */}
                    {/* <input className="w-full " {...register("equity", { required: true, min: 5 })} type="range" min={0} max={100} step={5} defaultValue={5} /> */}
                    <button type="submit">test</button>
                </form>
                <button onClick={createIdentity} className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2 my-8">
                    <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 16 16"><g fill="none" stroke="#f8f8f8" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"><path d="M14.25 8.75c-.5 2.5-2.385 4.854-5.03 5.38A6.25 6.25 0 0 1 3.373 3.798C5.187 1.8 8.25 1.25 10.75 2.25" /><path d="m5.75 7.75l2.5 2.5l6-6.5" /></g></svg>
                    DEPLOY
                </button>
                {/* <table className="table-auto border-fixed w-1/2">
                <thead>
                    <tr>
                        <th className="p-2 border w-3/4 border-slate-300">Address</th>
                        <th className="p-2 border border-slate-300">Equity</th>
                        <th className="p-2 border border-slate-300">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {owners.map((owner, idx) => {
                        return (
                            <>
                                <tr key={idx} >
                                    <td className="p-2 border text-center border-slate-300">{owner.address}</td>
                                    <td className="p-2 border text-center border-slate-300">{owner.equity} %</td>
                                    <td className="p-2 border text-center border-slate-300 text-red-500 underline cursor-pointer" onClick={() => {
                                        deleteOwner(idx)
                                    }}>delete</td>
                                </tr>
                            </>
                        )
                    })}
                </tbody>
            </table> */}
            </div>
        </div>
    )
}

export default Create