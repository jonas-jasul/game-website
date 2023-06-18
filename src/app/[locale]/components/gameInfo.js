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
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";

export default function GameInfo({ searchTerm, genreFilterValue, minRatingsFilterValue, sortGameVal }) {
  const t = useTranslations('GameInfo');
  const [gameData, setGameData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 20;
  const [pageNumber, setPageNumber] = useState(1);
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();

    useEffect(() => {
      const initialPage = parseInt(searchParams.get('page'), 10) || 1;
      setPageNumber(initialPage);
    }, []);
  

    const handlePageClick = (data) => {
      setPageNumber(data);

    }
  // useEffect(() => {
  //   const queryPage = parseInt(searchParams.get('page'), 10) || 1;
  //   if (queryPage !== pageNumber) {
  //     setPageNumber(queryPage);
  //   }
  // }, [searchParams, pageNumber]);
  
  useEffect(()=>{
        
    const current = new URLSearchParams(searchParams);
    current.set("page", pageNumber);
 
    const pageStr=current.toString();
    const query=pageStr ? `?${pageStr}`  : "";

    router.push(`${pathname}${query}`, undefined, {shallow: true})
  },[pathname, pageNumber, router, searchParams])

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
  }, [searchTerm, genreFilterValue, minRatingsFilterValue]);

  useEffect(() => {
    fetchGameData(pageNumber);
  }, [pageNumber, searchTerm, genreFilterValue, minRatingsFilterValue, sortGameVal]);


  const fetchGameData = async (pageNumber) => {
    setIsLoading(true);
    const offset = (pageNumber - 1) * pageSize;
    let gameDataQuery = `fields id, name, rating, cover, genres, slug; where rating != null & rating_count >= ${minRatingsFilterValue}`;

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
        cache: "no-store",
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
        slug: game.slug,
        rating: game.rating,
        coverUrl: cover
          ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`
          : null,
      };
    });

    setGameData(gamesWithCovers);
    setIsLoading(false);
  };

  const handleMoreInfoBtn = (gameId) => {
    router.push(`/catalogue/${gameId}`)
  }


  const renderGames = (

    <div className="p-5 flex flex-wrap justify-center items-center">
      {gameData.map((game) => (
        <div className="card lg:card-side bg-base-100 shadow-xl border border-primary p-0" key={game.id}>
          <figure className="h-60"><img className="h-full w-full object-cover" src={game.coverUrl} alt="cover" /></figure>
          <div className="card-body w-60">
            <h2 className="card-title text-xl">{game.name}</h2>
            <p><StarRating rating={game.rating} /></p>
            <div className="card-actions justify-end">
              <button onClick={() => { handleMoreInfoBtn(game.slug) }} className="btn btn-primary">{t('moreInfoBtn')}</button>
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