"use client";
import GameInfo from "./gameInfo";
import SearchGameBar from "./searchGame";
import FilterGameBar from "./filterGameBar";
import React, { useState } from "react";
import ShowHideFilterGameBar from "./showHideFilterGameBar";
import { CSSTransition } from 'react-transition-group';


const Game = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const handleSearch = (term) => {
        setSearchTerm(term);
    }
    const [showFilterDiv, setShowFilterDiv] = useState(false);
    // const [pushGameDivDown, setPushGameDivDown] = useState(false);
    const handleFilterClick = () => {
        setShowFilterDiv(!showFilterDiv);
        // setPushGameDivDown(!pushGameDivDown);
    }

    const [genreFilter, setGenreFilter] = useState(0);

    const handeFiltering = (filter) => {
        setGenreFilter(filter);
    }

    return (
        <>
            <div className="flex">
                <div className="flex mx-auto items-center">
                    <FilterGameBar onFilterClick={handleFilterClick} />

                </div>
                <div className="flex mx-auto">
                    <SearchGameBar onSearch={handleSearch}></SearchGameBar>
                </div>
            </div>



            <CSSTransition
                in={showFilterDiv}
                timeout={300}
                classNames="slideGameFilter"
                unmountOnExit
            >

                <ShowHideFilterGameBar onFilterApply={handeFiltering} />
            </CSSTransition>

            <CSSTransition
                in={showFilterDiv}
                timeout={300}
                classNames="slideDownGamesDiv"

            >
                <div>
                    <GameInfo searchTerm={searchTerm} genreFilterValue={genreFilter}></GameInfo>
                </div>
            </CSSTransition>

        </>
    )
}

export default Game;