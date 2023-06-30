"use client";
import GameInfo from "../components/gameInfo";
import SearchGameBar from "../components/ui/searchGame"
// import FilterGameBar from "./ui/filterGameBar";
import React, { Suspense, useState } from "react";
import ShowHideFilterGameBar from "../components/showHideFilterGameBar";
// import { CSSTransition } from 'react-transition-group';
import SortGameBar from "../components/ui/sortGameBar";
import CataloguePagination from "../components/ui/cataloguePagination"
import Loading from "./loading";


const Game = ({ searchParams }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (term) => {
        setSearchTerm(term);
    }

    const [genreFilter, setGenreFilter] = useState(0);

    const handeFiltering = (filter) => {
        setGenreFilter(filter);
    }

    const [minRatingsFilterVal, setMinRatingFilterVal] = useState(25);

    const handleMinRatingsFiltering = (filter) => {
        setMinRatingFilterVal(filter);
    }

    const [gameSortVal, setGameSortVal] = useState("rating");

    const handleGameSorting = (sort) => {
        setGameSortVal(sort);
    }

    const [pageNumber, setPageNumber] = useState(1);
    const handlePageChange = (newPageNr) => {
        setPageNumber(newPageNr);
    }

    return (
        <>
            <div className="flex flex-wrap">
                <div className="flex mx-auto items-center">
                    <ShowHideFilterGameBar searchParams={searchParams} onFilterApply={handeFiltering} onMinRatingFilterApply={handleMinRatingsFiltering} />

                </div>

                <div className="flex mx-auto items-center">
                    <SortGameBar searchParams={searchParams} onSortGames={handleGameSorting} />
                </div>
                <div className="flex mx-auto">
                    <SearchGameBar searchParams={searchParams} onSearch={handleSearch}></SearchGameBar>
                </div>
            </div>

            <div>
            <Suspense fallback={<Loading />} >
                <GameInfo searchParams={searchParams} onPageChange={handlePageChange} pageNumber={pageNumber} genreFilterValue={genreFilter} />
            </Suspense>
            </div>
            <div>
                <CataloguePagination searchTerm={searchTerm} searchParams={searchParams} />
            </div>
        </>
    )
}

export default Game;