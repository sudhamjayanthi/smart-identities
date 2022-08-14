import { useAccount } from "wagmi"

import { FeedbackFish } from "@feedback-fish/react";
import { SupportIcon } from "@heroicons/react/solid";

function FeedbackWidget() {
    const { data: user } = useAccount();

    return (
        <>
            {user?.address &&
                (<FeedbackFish projectId="14c9f0324fd38d" metadata={{ address: user?.address }} >
                    <button className="bg-blue-600 p-3 rounded-full fixed bottom-8 right-8  text-gray-100">
                        <SupportIcon className="w-8 h-8" />
                    </button>
                </FeedbackFish>)
            }
        </>
    )
}

export default FeedbackWidget;