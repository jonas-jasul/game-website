"use client";
import GameInfo from "./gameInfo";
import SearchGameBar from "./ui/searchGame";
import FilterGameBar from "./ui/filterGameBar";
import React, { useState } from "react";
import ShowHideFilterGameBar from "./showHideFilterGameBar";
// import { CSSTransition } from 'react-transition-group';
import SortGameBar from "./ui/sortGameBar";


const Game = ({searchParams}) => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (term) => {
        setSearchTerm(term);
    }
    const [showFilterDiv, setShowFilterDiv] = useState(false);
    // const [pushGameDivDown, setPushGameDivDown] = useState(false);
    const handleFilterClick = () => {
        // setShowFilterDiv(!showFilterDiv);
        // setPushGameDivDown(!pushGameDivDown);
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
                <GameInfo searchParams={searchParams} onPageChange={handlePageChange} pageNumber={pageNumber} searchTerm={searchTerm} genreFilterValue={genreFilter} minRatingsFilterValue={minRatingsFilterVal} sortGameVal={gameSortVal}></GameInfo>
            </div>
        </>
    )
}

export default Game;