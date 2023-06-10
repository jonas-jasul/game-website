'use client';
import { useEffect, useState } from "react";
import LoadingSpinner from "./loadingSpinner";
import { ClientID, Authorization } from "../config";
// import ReactPaginate from "react-paginate";
import ResponsivePagination from "react-responsive-pagination";
import "../css/gameInfo.css";
import SearchGameBar from "./searchGame";

export default function GameInfo({ searchTerm, genreFilterValue }) {

    const [gameData, setGameData] = useState([]);
    // const [gameCover, setGameCover] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [pageCount, setPageCount] = useState(0);
    // const [pageOffset, setPageOffset] = useState(0);
    const pageSize = 20;
    const [pageNumber, setPageNumber] = useState(1);

    const handlePageClick = (data) => {
        setPageNumber(data);
    }

    const fetchTotalGameCount = async () => {

        const countResponse = await fetch('http://localhost:8080/https://api.igdb.com/v4/games/count', {
            method: 'post',
            headers: {
                'Client-ID': ClientID,
                'Authorization': Authorization,
                'Accept': 'application/json',
            },
            body: searchTerm ? `where name ~ *"${searchTerm}"* & rating!=null & rating_count>=25;` : `where rating!=null & rating_count>=25;`,
        }
        );
        const { count } = await countResponse.json();
        console.log("Game count,", count);
        const totalPages = Math.ceil(count / pageSize);
        setPageCount(totalPages);
    };

    useEffect(() => {
        fetchTotalGameCount();
    }, [searchTerm]);

    useEffect(() => {
        fetchGameData(pageNumber, searchTerm);
    }, [pageNumber, searchTerm, genreFilterValue]);


    const fetchGameData = async (pageNumber) => {
        setIsLoading(true);
        const offset = (pageNumber - 1) * pageSize;

        const gamesResponse = await fetch('http://localhost:8080/https://api.igdb.com/v4/games?', {
            method: 'post',
            headers: {
                'Client-ID': ClientID,
                'Authorization': Authorization,
                'Accept': 'application/json',
            },
            body: `fields id, name, rating, cover, genres; limit ${pageSize}; offset ${offset};
                     where name ~ *"${searchTerm}"* ${genreFilterValue ? ` & genres = ${genreFilterValue}` : ''} & rating!=null & rating_count>=25;
                     sort rating desc;`,


            // 'fields id, name, rating, cover; limit 50; where rating!=null & rating_count>=25; sort rating desc;',

        });
        const dataGame = await gamesResponse.json();
        console.log(dataGame);
        // setGameData(dataGame);
        const imageIds = dataGame.map(game => game.id);
        console.log(imageIds);


        const coversResponse = await fetch('http://localhost:8080/https://api.igdb.com/v4/covers', {
            method: 'post',
            headers: {
                'Client-ID': ClientID,
                'Authorization': Authorization,
                'Accept': 'application/json',
            },
            body: `fields game, image_id; limit ${pageSize}; where game = (${imageIds.join(',')});`,

        });
        // `fields game, image_id; limit 50; where game = (${imageIds.join(',')});`,});
        const dataImg = await coversResponse.json();
        // setGameCover(dataImg);
        console.log(dataImg);

        const gamesWithCovers = dataGame.map(game => {
            const cover = dataImg.find((cover) => cover.game === game.id);
            // console.log(cover);
            return {
                id: game.id,
                name: game.name,
                coverUrl: cover ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg` : null,
            };
        });
        // setGameCover(dataImg);
        setGameData(gamesWithCovers);
        setIsLoading(false);
        // setPageCount(Math.ceil(dataGame.length / pageSize));

    };
    // fetchTotalGameCount();
    // fetchGameCover()


    const renderGames = (

        <div className="p-5 flex flex-wrap justify-center items-center">
            {gameData.map((game) => (
                <div className="card lg:card-side bg-base-100 shadow-xl border border-primary" key={game.id}>
                    <figure className="h-60 w-44"><img className="h-full w-full object-cover" src={game.coverUrl} alt="cover" /></figure>
                    <div className="card-body w-60">
                        <h2 className="card-title">{game.name}</h2>
                        <p>Description.</p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">More info</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <>
            <div className="flex">
                {isLoading ? <LoadingSpinner></LoadingSpinner> : renderGames}
            </div>
            <div className="flex w-40 mx-auto pagination justify-center items-center">
                <ResponsivePagination
                    current={pageNumber}
                    total={pageCount}
                    onPageChange={handlePageClick}
                    maxVisiblePages={5}
                />
            </div>

        </>
    )

}