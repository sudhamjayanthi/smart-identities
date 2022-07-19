import { Fragment, useState } from 'react'
import { Dialog, Transition } from '@headlessui/react'

const Modal = (props) => {
    let [isOpen, setIsOpen] = useState(false)

    const { title, toggleStyle, toggleText, children } = props;

    function closeModal() {
        setIsOpen(false)
    }

    function openModal() {
        setIsOpen(true)
    }

    return (
        <>
            <div >
                <button
                    onClick={openModal}
                    className={`flex gap-2 ${toggleStyle}`}
                >
                    {props.icon && props.icon}
                    <span className="font-medium">
                        {toggleText}
                    </span>
                </button>
            </div>

            <Transition appear show={isOpen} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={closeModal}>
                    <Transition.Child
                        as={Fragment}
                    >
                        <div className="fixed inset-0 bg-black bg-opacity-30 backdrop-blur-sm" />
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
                                <Dialog.Panel className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-gray-800 p-6 text-left align-middle shadow-xl transition-all ">
                                    <Dialog.Title
                                        as="h3"
                                        className="text-lg font-medium text-white"
                                    >
                                        {title}
                                    </Dialog.Title>
                                    {children}
                                </Dialog.Panel>
                            </Transition.Child>
                        </div>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default Modal