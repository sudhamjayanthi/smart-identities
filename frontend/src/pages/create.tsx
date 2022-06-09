import { useForm } from "react-hook-form";

import { useRouter } from "next/router";
import { useEffect, useState } from "react"

import { useAddRecentTransaction } from '@rainbow-me/rainbowkit';
import { useAccount, useContractWrite, useContractEvent } from "wagmi";

import Modal from "@components/Modal"
import IdentityFactoryABI from "@/utils/IdentityFactory.json";
import { EXPLORER, FACTORY_ADDRESS } from "@/lib/constants";

import toast from "react-hot-toast";
import { CheckCircleIcon } from "@heroicons/react/outline";

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
        <div className="flex flex-col flex-1 justify-center items-center gap-10">
            <div className="flex justify-between gap-20 w-1/2">
                <h2 className="text-3xl font-extrabold text-blue-600">Owners</h2>
                <Modal title="Add Owner" toggleText="+ add" toggleStyle="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                    <form className="space-y-6 mt-2" onSubmit={handleSubmit(onSubmit)}>
                        <div>
                            <label htmlFor="address" className="text-gray-800 font-medium">Address</label>
                            <input className="border-slate-300 border-[1px] rounded w-full px-2 py-1 outline-none block" {...register("address", { required: true, pattern: /^0x[a-fA-F0-9]{40}$/ })} type="string" defaultValue={owners.length === 0 ? data?.address : ""} />
                            {errors.address && <span className="text-red-400">Please enter a valid address</span>}
                        </div>
                        <div>
                            <label htmlFor="equity" className="text-gray-800 font-medium">Equity - </label>
                            <span className="text-gray-600">{watch("equity") || 5}%</span><br />
                            <input className="w-full " {...register("equity", { required: true, min: 5 })} type="range" min={0} max={100} step={5} defaultValue={5} />
                            {errors.equity && <span className="text-red-400">Minimum equity should be 5%</span>}
                        </div>
                        <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
                    </form>
                </Modal>
            </div>
            <table className="table-auto border-fixed w-1/2">
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
            </table>
            <button onClick={createIdentity} className="bg-green-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                <CheckCircleIcon className="w-6 h-6" />Deploy Identity
            </button>
        </div>
    )
}

export default Create