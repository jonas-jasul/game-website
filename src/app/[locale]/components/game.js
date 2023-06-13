"use client";
import GameInfo from "./gameInfo";
import SearchGameBar from "./searchGame";
import FilterGameBar from "./filterGameBar";
import React, { useState } from "react";
import ShowHideFilterGameBar from "./showHideFilterGameBar";
// import { CSSTransition } from 'react-transition-group';
import SortGameBar from "./sortGameBar";


const Game = () => {
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

    return (
        <>
            <div className="flex flex-wrap">
                <div className="flex mx-auto items-center">
                    <ShowHideFilterGameBar onFilterApply={handeFiltering}  onMinRatingFilterApply={handleMinRatingsFiltering}/>

                </div>

                <div className="flex mx-auto items-center">
                    <SortGameBar onSortGames={handleGameSorting} />
                </div>
                <div className="flex mx-auto">
                    <SearchGameBar onSearch={handleSearch}></SearchGameBar>
                </div>
            </div>



            {/* <CSSTransition
                in={showFilterDiv}
                timeout={300}
                classNames="slideGameFilter"
                unmountOnExit
            > */}

                {/* <ShowHideFilterGameBar onFilterApply={handeFiltering} /> */}
            {/* </CSSTransition> */}

            {/* <CSSTransition
                in={showFilterDiv}
                timeout={300}
                classNames="slideDownGamesDiv"

            > */}
                <div>
                    <GameInfo searchTerm={searchTerm} genreFilterValue={genreFilter} minRatingsFilterValue={minRatingsFilterVal} sortGameVal={gameSortVal}></GameInfo>
                </div>
            {/* </CSSTransition> */}

        </>
    )
}

export default Game;