import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form";
import { useAccount, useContractWrite } from "wagmi";
import IdentitesABI from "../utils/IdentitiesABI.json";

const Create = () => {
    const { data } = useAccount();
    const router = useRouter();

    const [owners, setOwners] = useState([])
    const [showModal, setShowModal] = useState(false)

    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    const onSubmit = (data) => {
        setOwners([...owners, data])
        setShowModal(false)
        console.log(data)
    };

    useEffect(() => {
        if (!data?.address) {
            router.push("/");
        }
    }, [data])

    // const isNotValid = () => {
    //     const addresses = owners.map(owner => owner.address);
    //     const equities = owners.map(owner => parseInt(owner.equity));

    //     const duplicateAddress = addresses.some((address) => {
    //         return addresses.indexOf(address) !== addresses.lastIndexOf(address); // checks for multiple instances of same address
    //     })

    //     if (duplicateAddress) {
    //         console.log(addresses)
    //         return "all the owners should be unique"
    //     }

    //     const equitiesSum = equities.reduce((a, b) => a + b, 0)

    //     if (equitiesSum !== 100) {
    //         console.log(equitiesSum)
    //         return "equities should add up to 100 %"
    //     }

    //     console.log("no validation errors")
    //     return 0
    // }


    const identitiesConfig = {
        addressOrName: '0x12e821387ca60c4ab557d39a3dc0b7b65c8d0f0f',
        contractInterface: IdentitesABI,
    }

    const { data: txData, isLoading, isSuccess, write } = useContractWrite(
        identitiesConfig,
        'createNewIdentity'
    )

    const useCreateIdentity = () => {
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
        // alert("successfully created identity")
        console.log(txData)
        // router.push(`/identity/${identityAddress}`)
        // router.push("/dashboard")
    }

    // const deleteOwner = i => {
    //     let arr = owners
    //     arr.splice(i)
    //     setOwners(arr)
    // }

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
                    <div className="flex gap-20">
                        <h2 className="text-3xl font-extrabold text-blue-600">Owners</h2>
                        <button onClick={() => {
                            setShowModal(true);

                        }} className="bg-blue-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>Add User
                        </button>
                    </div>
                    <table className="table-auto border-fixed">
                        <thead>
                            <tr>
                                <th className="p-2 border border-slate-300">Address</th>
                                <th className="p-2 border border-slate-300">Equity</th>
                            </tr>
                        </thead>
                        <tbody>
                            {owners.map((owner, idx) => {
                                return (
                                    <>
                                        {/* <tr key={idx} className="cursor-pointer" onClick={() => deleteOwner(idx)}> */}
                                        <tr key={idx} >
                                            <td className="p-2 border border-slate-300">{owner.address}</td>
                                            <td className="p-2 border border-slate-300">{owner.equity} %</td>
                                        </tr>
                                    </>
                                )
                            })}
                        </tbody>
                    </table>

                    <button onClick={useCreateIdentity} className="bg-green-600 text-white font-medium px-4 py-2 rounded-lg flex items-center gap-2">
                        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>Create Identity
                    </button>
                </>
            )
            }
        </div >
    )
}

export default Create