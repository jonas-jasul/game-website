import React from "react";
export default function LoadingSpinner() {
    return (
        <div className="flex mx-auto items-center justify-center h-screen">
            <div
                className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                role="status">
            </div>
            <span className="overflow-hidden whitespace-nowrap p-2"
            >Loading...</span>
        </div>
    )
}