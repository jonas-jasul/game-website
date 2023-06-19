import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useState } from "react";

const SortGameBar = ({onSortGames, searchParams}) => {
    const t = useTranslations('SortDropdown');
    const [sortValue, setSortValue] = useState("rating");
    const router= useRouter();
    const pathname = usePathname();

    const handleSortChange = (e) =>{
        setSortValue(e.target.value);
        // console.log(sortValue);
        const url = new URLSearchParams(searchParams);
        url.set("sort", e.target.value);
        const urlStr=url.toString();

        router.push(`${pathname}?${urlStr}`);
    };

    useEffect(()=> {
        onSortGames(sortValue);
    }, [sortValue, onSortGames]);


    return (
        <div className="flex mt-3 mb-0">
            <select onChange={handleSortChange} value={sortValue} className="select select-bordered w-full max-w-xs">
                <option value="rating" selected>{t('rating')}</option>
                <option value="first_release_date">{t("releaseDate")}</option>
                <option value="name">{t('title')}</option>
            </select>
        </div>
    )
}

export default SortGameBar;