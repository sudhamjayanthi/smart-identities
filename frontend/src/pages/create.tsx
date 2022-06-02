import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useAccount, useContractWrite, useContractEvent } from "wagmi";
import { abi } from "../utils/IdentityFactory.json";

const Create = () => {
    const router = useRouter();
    const { data } = useAccount();

    const [owners, setOwners] = useState([])
    const [showModal, setShowModal] = useState(false)
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const identityFactoryConfig = {
        addressOrName: '0x3adF99a751732dd83E3C91f7Cd42e4180EE39101',
        contractInterface: abi,
    }

    const { data: txData, isLoading, isSuccess, write } = useContractWrite(
        identityFactoryConfig,
        'createIdentity'
    )

    useContractEvent(
        identityFactoryConfig,
        'NewIdentity',
        (event) => {
            router.push(`/identity/${event.identity}`)
        }, { once: true }
    )

    const createIdentity = () => {
        const addresses = owners.map(owner => owner.address);
        const equities = owners.map(owner => parseInt(owner.equity));

        const duplicateAddress = addresses.some((address) => {
            return addresses.indexOf(address) !== addresses.lastIndexOf(address); // checks for multiple instances of same address
        })

        if (duplicateAddress) {
            console.log("list of addresses : ", addresses)
            alert("all the owners should be unique")
            return
        }

        const equitiesSum = equities.reduce((a, b) => a + b, 0)

        if (equitiesSum !== 100) {
            console.log("sum of equities : ", equitiesSum)
            alert("equities should add up to 100 %")
            return
        }

        console.log("no validation errors")

        write({
            args: [addresses, equities]
        });

    }

    if (isLoading) {
        try {
            console.log(`mining txn : https://mumbai.polygonscan.com/tx/${txData.hash}`)
        } catch {

        }
    }

    if (isSuccess) {
        console.log("successfully created identity, you will be redirected in few secs!")
        console.log(txData)
        // const idenitiyAddress = txData
        // router.push(`/identity/${identityAddress}`)
        // router.push("/dashboard")
    }

    useEffect(() => {
        if (!data?.address) {
            router.push("/");
        }
    }, [data])

    const deleteOwner = i => {
        const arr = [...owners]
        arr.splice(i)
        setOwners(arr)
    }

    const onSubmit = (data) => {
        setOwners([...owners, data])
        setShowModal(false)
        console.log(data)
    };

    return (
        <div className="flex flex-col flex-1 justify-center items-center gap-10">
            {showModal ? (
                <div className="flex w-1/2 justify-center">
                    <div className="relative p-4 w-full max-w-md h-full md:h-auto">

                        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
                            <button onClick={e => setShowModal(false)} type="button" className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm p-1.5 ml-auto inline-flex items-center dark:hover:bg-gray-800 dark:hover:text-white" >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
                            </button>
                            <div className="py-6 px-6 lg:px-8">
                                <h3 className="mb-4 text-xl font-medium text-gray-900 dark:text-white">Add Owner</h3>
                                <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
                                    <div>
                                        <label htmlFor="address" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Address</label>
                                        <input {...register("address", { required: true, pattern: /^0x[a-fA-F0-9]{40}$/ })} type="string" name="address" id="address" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white outline-none" defaultValue={owners.length !== 0 ? "" : data?.address} required />
                                        {errors.address && <span className="text-red-400">Please enter a valid address</span>}
                                    </div>
                                    <div>
                                        <label htmlFor="equity" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">Equity</label>
                                        <input {...register("equity", { required: true, min: 5 })} type="range" min={0} max={100} step={5} defaultValue={watch("equity") || 5} name="equity" id="equity" className="w-full" required />
                                        <span className="text-gray-300">{watch("equity") || 0}%</span><br />
                                        {errors.equity && <span className="text-red-400">Minimum equity should be 5%</span>}
                                    </div>
                                    <button type="submit" className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Add</button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <div className="flex justify-between gap-20 w-1/2">
                        <h2 className="text-3xl font-extrabold text-blue-600">Owners</h2>
                        <button onClick={() => {
                            setShowModal(true);

                        }} className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>Add User
                        </button>
                    </div>
                    <table className="table-auto border-fixed w-1/2">
                        <thead>
                            <tr>
                                <th className="p-2 border w-3/4 border-slate-300">Address</th>
                                <th className="p-2 border border-slate-300">Equity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {owners.map((owner, idx) => {
                                return (
                                    <>
                                        <tr key={idx} className="cursor-pointer" onClick={() => {
                                            console.log(owner, idx)
                                            deleteOwner(idx)
                                            console.log(owners)
                                        }}>
                                            {/* <tr key={idx} > */}
                                            <td className="p-2 border text-center border-slate-300">{owner.address}</td>
                                            <td className="p-2 border text-center border-slate-300">{owner.equity} %</td>
                                        </tr>
                                    </>
                                )
                            })}
                        </tbody>
                    </table>
                    <span className="text-gray-500 text-sm">click on any row to delete it</span>

                    <button onClick={createIdentity} className="bg-green-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
                        </svg>Create Identity
                    </button>
                </>
            )
            }
        </div >
    )
}

export default Create