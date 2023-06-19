import { useState } from "react";
import React from "react";
// import Select from 'react-select';
import { Authorization, ClientID } from "../../config";
import { useEffect } from "react";
import { useRef } from "react";
import { RxCrossCircled, RxCheckCircled } from "react-icons/rx";
import { RxDropdownMenu } from "react-icons/rx";
import GameGenreDropdown from "./ui/gameGenreDropdown";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
export default function ShowHideFilterGameBar({ onFilterApply, onMinRatingFilterApply, searchParams }) {

    const t = useTranslations('FilterBar');
    const router = useRouter();
    const pathname = usePathname();
    const [gameGenres, setGameGenres] = useState([]);
    const [gameGenreValue, setGameGenreValue] = useState("");

    const [gameGenreDropdownItems, setGameGenreDropdownItems] = useState([]);
    const [gameMinRatings, setGameMinRatings] = useState(25);

    const handleRatingSliderChange = (event) => {
        setGameMinRatings(event.target.value);
    }

    const fetchAllGameGenres = async () => {
        const genreResponse = await fetch('http://localhost:8080/https://api.igdb.com/v4/genres', {
            method: 'post',
            headers: {
                'Client-ID': ClientID,
                'Authorization': Authorization,
                'Accept': "application/json",
            },
            body: 'fields name; limit 100;'
        }
        );

        const dataGenres = await genreResponse.json();
        console.log(dataGenres);
        const genreArr = dataGenres.map((game) => ({
            id: game.id,
            name: game.name,
        }));

        setGameGenres(genreArr)
        console.log(gameGenres);
    }

    const applyFilter = () => {
        const selectedGenres = gameGenres.find((genre) => genre.name === gameGenreValue);


        if (selectedGenres) {
            onFilterApply(selectedGenres?.id);
            const current = new URLSearchParams(searchParams);
            current.set("genre", selectedGenres?.name.toLowerCase());
            current.set("page", 1);
            const urlStr = current.toString();
            // const urlStr = current.toString();
            // const query = urlStr ? `?${urlStr}` : "";
            router.push(`${pathname}?${urlStr}`);
            console.log(urlStr);
        } else {
            onFilterApply(null);
        }

    }

    const applyMinRatingFilter = () => {
        onMinRatingFilterApply(gameMinRatings);
        const url=new URLSearchParams(searchParams);
        url.set("min_ratings", gameMinRatings);
        const urlStr = url.toString();
        router.push(`${pathname}?${urlStr}`);
    }

    const clearFilters = () => {
        setGameGenreValue('');
        setGameMinRatings(25);
        const current = new URLSearchParams(searchParams);
        current.delete("genre");
        current.set("page", 1);
        const urlStr=current.toString();
        router.push(`${pathname}?${urlStr}`)
    }


    useEffect(() => {
        fetchAllGameGenres();
    }, []);

    useEffect(() => {

        if (!gameGenreValue) {
            setGameGenreDropdownItems(gameGenres.map((genre) => genre.name));
            return;
        }
        const newGenres = gameGenres.filter((genre) => genre.name.toLowerCase().includes(gameGenreValue.toLowerCase()))
            .map((genre) => genre.name)
            .sort();
        setGameGenreDropdownItems(newGenres);
    }, [gameGenres, gameGenreValue]);


    return (
        <div className="drawer" style={{ zIndex: 2 }}>
            <input id="my-drawer" type="checkbox" className="drawer-toggle" />
            <div className="drawer-content flex mt-3">
                <label htmlFor="my-drawer" className="btn btn-secondary drawer-button">{t('filterBtn')} <RxDropdownMenu size='1.4rem' className="m-1" /> </label>
            </div>
            <div className="drawer-side">
                <label htmlFor="my-drawer" className="drawer-overlay"></label>
                <ul className="menu p-4 w-84 lg:w-96 h-full bg-base-200 text-base-content">
                    <li className="flex items-center text-lg font-semibold">{t('gameFilterOptTitle')}</li>
                    <div class="divider"></div>
                    <li>
                        {t('gameFilterGameGenre')}
                        <GameGenreDropdown value={gameGenreValue} items={gameGenreDropdownItems} onChange={setGameGenreValue} />
                    </li>
                    <li>
                        {t('gameFilterMinRatings')}
                        <input type="range" min={0} max={150} value={gameMinRatings} onChange={handleRatingSliderChange} className="range range-primary" />{gameMinRatings}
                    </li>


                    <div className="flex justify-end">
                        <li>
                            <button onClick={clearFilters} className="btn bg-error flex flex-col justify-center items-center hover:bg-error-content">
                                <div className="flex items-center">
                                    {t('gameFilterClear')}
                                    <RxCrossCircled size={'1.4em'} />
                                </div>

                            </button>
                        </li>

                        <li>
                            <button onClick={() => { applyFilter(), applyMinRatingFilter() }} className="btn bg-success flex flex-col items-center justify-center">
                                <div className="flex items-center">
                                    {t('gameFilterApply')}
                                    <RxCheckCircled size={'1.4em'} />
                                </div>
                            </button>

                        </li>
                    </div>

                </ul>
            </div>
        </div>
    )
}
