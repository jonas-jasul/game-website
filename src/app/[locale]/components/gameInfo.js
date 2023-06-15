'use client';
import { useEffect, useState } from "react";
import LoadingSpinner from "./common/loadingSpinner";
import { ClientID, Authorization } from "../../config";
// import ReactPaginate from "react-paginate";
import ResponsivePagination from "react-responsive-pagination";
import "../css/gameInfo.css";
import SearchGameBar from "./ui/searchGame";
import StarRating from "./ui/starRating";
import { useTranslations } from "next-intl";

export default function GameInfo({ searchTerm, genreFilterValue, minRatingsFilterValue, sortGameVal}) {
    const t= useTranslations('GameInfo');
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
        let countQuery = `where rating_count>=${minRatingsFilterValue}`;

        if (genreFilterValue) {
            countQuery += ` & genres = ${genreFilterValue}`;
        }

        if (searchTerm) {
            countQuery += ` & name ~ *"${searchTerm}"*`;
        }

        countQuery += ';';
        
        const countResponse = await fetch('http://localhost:8080/https://api.igdb.com/v4/games/count', {
            method: 'post',
            headers: {
                'Client-ID': ClientID,
                'Authorization': Authorization,
                'Accept': 'application/json',
            },
            body: countQuery,
        }
        );
        const { count } = await countResponse.json();
        console.log("Game count,", count);
        const totalPages = Math.ceil(count / pageSize);
        setPageCount(totalPages);
    };

    useEffect(() => {
        fetchTotalGameCount();
      }, [searchTerm, genreFilterValue, minRatingsFilterValue, pageCount]);
      
      useEffect(() => {
        fetchGameData(pageNumber);
      }, [pageNumber, searchTerm, genreFilterValue, minRatingsFilterValue, sortGameVal]);
      


    const fetchGameData = async (pageNumber) => {
        setIsLoading(true);
        const offset = (pageNumber - 1) * pageSize;
        let gameDataQuery = `fields id, name, rating, cover, genres; where rating != null & rating_count >= ${minRatingsFilterValue}`;
      
        if (searchTerm) {
          gameDataQuery += ` & name ~ *"${searchTerm}"*`;
        }
      
        if (genreFilterValue) {
          gameDataQuery += ` & genres = ${genreFilterValue}`;
        }
      
        if (sortGameVal) {
          gameDataQuery += `; sort ${sortGameVal} desc`;
        }
      
        gameDataQuery += `; limit ${pageSize}; offset ${offset};`;
      
        const gamesResponse = await fetch(
          'http://localhost:8080/https://api.igdb.com/v4/games',
          {
            method: 'post',
            headers: {
              'Client-ID': ClientID,
              'Authorization': Authorization,
              'Accept': 'application/json',
            },
            body: gameDataQuery,
          }
        );
      
        const dataGame = await gamesResponse.json();
        console.log(dataGame);
      
        const imageIds = dataGame.map((game) => game.id);
        console.log(imageIds);
      
        const coversResponse = await fetch(
          'http://localhost:8080/https://api.igdb.com/v4/covers',
          {
            method: 'post',
            headers: {
              'Client-ID': ClientID,
              'Authorization': Authorization,
              'Accept': 'application/json',
            },
            body: `fields game, image_id; where game = (${imageIds.join(
              ','
            )}); limit ${pageSize};`,
          }
        );
      
        const dataImg = await coversResponse.json();
        console.log(dataImg);
      
        const gamesWithCovers = dataGame.map((game) => {
          const cover = dataImg.find((cover) => cover.game === game.id);
          return {
            id: game.id,
            name: game.name,
            rating: game.rating,
            coverUrl: cover
              ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`
              : null,
          };
        });
      
        setGameData(gamesWithCovers);
        setIsLoading(false);
      };


    const renderGames = (

        <div className="p-5 flex flex-wrap justify-center items-center">
            {gameData.map((game) => (
                <div className="card lg:card-side bg-base-100 shadow-xl border border-primary" key={game.id}>
                    <figure className="h-60"><img className="h-full w-full object-cover" src={game.coverUrl} alt="cover" /></figure>
                    <div className="card-body w-60">
                        <h2 className="card-title">{game.name}</h2>
                        <p><StarRating rating={game.rating}/></p>
                        <div className="card-actions justify-end">
                            <button className="btn btn-primary">{t('moreInfoBtn')}</button>
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