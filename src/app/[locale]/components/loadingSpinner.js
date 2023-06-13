import { useTranslations } from "next-intl";
import React from "react";
export default function LoadingSpinner() {
    const t = useTranslations('Index');
    return (
        <div className="flex mx-auto items-center justify-center h-screen">
            <div
                className="loading loading-infinity loading-lg"
                role="status">
            </div>
            <span className="overflow-hidden whitespace-nowrap p-2"
            >{t("loading")}</span>
        </div>
    )
}