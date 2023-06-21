"use client";
import { useState } from "react";
import React from "react";
import { Authorization, ClientID } from "../../config";
import { useEffect } from "react";
import { useRef } from "react";
import { RxCrossCircled, RxCheckCircled } from "react-icons/rx";
import { RxDropdownMenu } from "react-icons/rx";
import GameGenreDropdown from "./ui/gameGenreDropdown";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import GameCategoryDropdown from "./ui/gameCategoryDropdown";
import ca from "date-fns/locale/ca/index";
export default function ShowHideFilterGameBar({ onFilterApply, onMinRatingFilterApply, searchParams }) {

    const t = useTranslations('FilterBar');
    const router = useRouter();
    const pathname = usePathname();
    const [gameGenres, setGameGenres] = useState([]);
    const [gameGenreValue, setGameGenreValue] = useState("");

    const [gameGenreDropdownItems, setGameGenreDropdownItems] = useState([]);
    const [gameMinRatings, setGameMinRatings] = useState(25);
    const [gameCategDropdownItems, setGameCategDropdownItems] = useState([]);

    const categoryEnums = [
        { id: 0, name: 'Main Game', slug: 'main_game' },
        { id: 1, name: 'DLC / Add-on', slug: 'dlc_addon' },
        { id: 2, name: 'Expansion', slug: 'expansion' },
        { id: 3, name: 'Bundle', slug: 'bundle' },
        { id: 4, name: 'Standalone Expansion', slug: 'standalone_expansion' },
        { id: 5, name: 'Mod', slug: 'mod' },
        { id: 6, name: 'Episode', slug: 'episode' },
        { id: 7, name: 'Season', slug: 'season' },
        { id: 8, name: 'Remake', slug: 'remake' },
        { id: 9, name: 'Remaster', slug: 'remaster' },
        { id: 10, name: 'Expanded Game', slug: 'expanded_game' },
        { id: 11, name: 'Port', slug: 'port' },
        { id: 12, name: 'Fork', slug: 'fork' },
        { id: 13, name: 'Pack', slug: 'pack' },
        { id: 14, name: 'Update', slug: 'update' },
    ];

    const [gameCategoryValue, setGameCategoryValue] = useState("");
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
            body: 'fields name,slug; limit 100;'
        }
        );

        const dataGenres = await genreResponse.json();
        console.log(dataGenres);
        const genreArr = dataGenres.map((game) => ({
            id: game.id,
            name: game.name,
            slug: game.slug,
        }));

        setGameGenres(genreArr)
        console.log(gameGenres);
        return genreArr;
    }

    const { data: genreData, isLoading: genreIsLoading, isFetching: genreIsFetching } = useQuery({
        queryKey: ["genre-dropdown-query"],
        queryFn: fetchAllGameGenres
    })



    const applyFilter = (e) => {

        const selectedGenres = genreData?.find((genre) => genre.name === gameGenreValue);
        const current = new URLSearchParams(searchParams);

        if (selectedGenres) {
            // onFilterApply(selectedGenres?.id);
            current.set("genre", selectedGenres?.name);
            current.set("page", 1);
        }
        if (gameCategoryValue) {
            current.set("category", gameCategoryValue);
            current.set("page", 1);
        }

        current.set("min_ratings", gameMinRatings);
        const urlStr = current.toString().toLowerCase();
        router.push(`${pathname}?${urlStr}`);
    }


    function clearFilters() {
        setGameGenreValue('');
        setGameCategoryValue('');
        setGameMinRatings(25);
        const current = new URLSearchParams(searchParams);
        current.delete("genre");
        current.delete("category");
        current.set("page", 1);
        current.set("min_ratings", 25);
        const urlStr = current.toString();
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

    useEffect(() => {
        if (!gameCategoryValue) {
            setGameCategDropdownItems(categoryEnums.map((category) => category.name));
            return;
        }
        const newCategs = categoryEnums.filter((category) => category.name.toLowerCase().includes(gameCategoryValue.toLowerCase()))
            .map((category) => category.name)
            .sort();
        setGameCategDropdownItems(newCategs);
    }, [gameCategoryValue])

    function submitFilters() {
        applyFilter();
    }

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
                    <h5 className="font-semibold">{t('gameFilterGameGenre')}</h5>
                    <li className="mb-2">
                        <GameGenreDropdown value={gameGenreValue} items={gameGenreDropdownItems} onChange={setGameGenreValue} />
                    </li>
                    <h5 className="font-semibold">{t('gameFilterMinRatings')}</h5>
                    <li className="mb-2">
                        <input type="range" min={0} max={150} value={gameMinRatings} onChange={handleRatingSliderChange} className="range range-primary" />{gameMinRatings}
                    </li>

                    <li className="mb-2">
                        Select category:
                        <GameCategoryDropdown items={gameCategDropdownItems} value={gameCategoryValue} onChange={setGameCategoryValue} />
                    </li>

                    <div className="flex justify-end">
                        <li>
                            <button onClick={clearFilters} className="btn bg-error flex flex-col justify-center items-center hover:bg-error">
                                <div className="flex items-center">
                                    {t('gameFilterClear')}
                                    <RxCrossCircled size={'1.4em'} />
                                </div>

                            </button>
                        </li>

                        <li>
                            <button onClick={submitFilters} className="btn bg-success flex flex-col items-center justify-center hover:bg-success">
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
