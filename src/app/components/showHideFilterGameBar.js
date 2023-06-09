import { useState } from "react";
import React from "react";
import Select from 'react-select';
import { Authorization, ClientID } from "../config";
import { useEffect } from "react";
import { useRef } from "react";

export default function ShowHideFilterGameBar({ onFilterApply }) {

    const [selectedGenres, setSelectedGenres] = useState(null);
    const [selectedGenreIndex, setSelectedGenreIndex] = useState(null);
    const genreSelectRef = useRef();
    const [gameGenres, setGameGenres] = useState([]);
    const [gameGenreOptions, setGameGenreOptions] = useState([]);
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
        const genreArr = dataGenres.map(game => game.name);
        setGameGenres(genreArr)
        console.log(gameGenres);
        const genreOptions = dataGenres.map(genre => {
            return {
                label: genre.name,
                value: genre.id,
            };
        });

        setGameGenreOptions(genreOptions);
        console.log(gameGenreOptions);
    }

    const applyGenre = () => {
        onFilterApply(selectedGenreIndex);
        console.log(selectedGenreIndex);
    }

    const clearFilters = () => {
        genreSelectRef.current.clearValue();
        setSelectedGenreIndex(null);
        setSelectedGenres(null);
    }

    const handleGenreChange =(selectedGenres) =>{
        const genreId = selectedGenres ? selectedGenres.value : null;
        setSelectedGenreIndex(genreId);
    }

    useEffect(() => {
        fetchAllGameGenres();
    }, []);
    return (
        <div className="flex bg-slate-300 mt-3 w-10/12 mx-auto p-2 dark:bg-slate-600">
            <div className="flex mx-auto">
                <div className="genreDiv flex justify-center align-middle ">
                    <p className="my-auto mx-2">Genre: </p>
                    <Select options={gameGenreOptions}
                        placeholder="Select genre"
                        isClearable={true}
                        ref={genreSelectRef}
                        onChange={handleGenreChange}
                            
                    />
                </div>
            </div>

            <div className="mx-2">
                <button onClick={clearFilters} className="bg-red-500 p-1 rounded-md hover:bg-red-600">Clear</button>
            </div>
            <div>
                <button onClick={applyGenre} className="bg-green-400 p-1 rounded-md hover:bg-green-500">Apply</button>
            </div>
        </div>
    )
}
