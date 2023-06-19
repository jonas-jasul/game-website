'use client';
import { useEffect, useState } from "react";
import LoadingSpinner from "./common/loadingSpinner";
import { ClientID, Authorization } from "../../config";
// import ReactPaginate from "react-paginate";
import ResponsivePagination from "react-responsive-pagination";
import "../css/gameInfo.css";
import SearchGameBar from "./ui/searchGame";
import { useQuery, useMutation } from "@tanstack/react-query";
import StarRating from "./ui/starRating";
import { useTranslations } from "next-intl";
import { usePathname, useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

export default function GameInfo({ searchParams, searchTerm, minRatingsFilterValue, sortGameVal }) {
  const t = useTranslations('GameInfo');
  const [pageCount, setPageCount] = useState(0);
  const pageSize = 20;
  // const [pageNumber, setPageNumber] = useState(1);
  const router = useRouter();
  const pathname = usePathname();
  const queryClient = useQueryClient()

  useEffect(() => {
    if (searchParams.page) {

    } else if (!searchParams.page) {

      router.push(`${pathname}?page=1`, undefined, { shallow: true });

    }
  }, [searchParams.page, searchParams.genre]);


  const handlePageClick = (data) => {
    const current = new URLSearchParams(searchParams);
    current.set("page", data);
    const pageStr = current.toString();
    const query = pageStr ? `?${pageStr}` : "";
    router.push(`${pathname}${query}`);
    // setPageNumber(data);
  }

  async function fetchGameGenres() {
    const genreResponse = await fetch('http://localhost:8080/https://api.igdb.com/v4/genres', {
      method: 'post',
      headers: {
        'Client-ID': ClientID,
        'Authorization': Authorization,
        'Accept': "application/json",
      },
      body: 'fields name; limit 50;'
    });

    const dataGenres = await genreResponse.json();
    console.log(dataGenres);
    const genreArr = dataGenres.map((game) => ({
      id: game.id,
      name: game.name.toLowerCase(),
    }));

    return genreArr;
  }



  const fetchTotalGameCount = async () => {

    const genreArr = await fetchGameGenres();

    let countQuery = `where rating_count>=${minRatingsFilterValue}`;

    if (searchParams.genre) {
      const genreQuery = genreArr.find((genre) => genre.name === searchParams.genre);

      countQuery += ` & genres = ${genreQuery.id}`;
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
  }, [searchParams.search, searchParams.genre, searchParams.page, searchParams.min_ratings]);


  async function fetchGameData() {
    const genreArr = await fetchGameGenres();

    console.log("genre param", searchParams.genre)
    const offset = (searchParams.page - 1) * pageSize

    
    const minRatings = searchParams.min_ratings ?? 25;


    let gameDataQuery = `fields id, name, rating, cover, genres, slug; where rating != null & rating_count >= ${minRatings}`;

    if (searchParams.search) {
      gameDataQuery += ` & name ~ *"${searchParams.search}"*`;
    }

    if (searchParams.genre) {
      const genreQuery = genreArr.find((genre) => genre.name === searchParams.genre);
      console.log("genre query", genreQuery);
      gameDataQuery += ` & genres = ${genreQuery.id}`;
    }

    if (searchParams.sort) {
      gameDataQuery += `; sort ${searchParams.sort} desc`;
    } else {
      gameDataQuery += `; sort rating desc`
    }

    gameDataQuery += `; limit ${pageSize}; offset ${offset};`;
    console.log("offset", offset)
    console.log(gameDataQuery);
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
    console.log("dataImg", dataImg);
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
    console.log("games with covers", gamesWithCovers);
    return gamesWithCovers;
  }


  const handleMoreInfoBtn = (gameId) => {
    router.push(`/catalogue/${gameId}`)
  }

  const { data: gameQuery, isLoading: gameQueryIsLoading, isFetching: gameQueryIsFetching, refetch: gameRefetch } = useQuery({
    queryKey: ['games', searchParams.page, searchParams.genre, searchParams.sort, searchParams.search, searchParams.min_ratings],
    queryFn: fetchGameData, refetchOnWindowFocus: false
  })


  if (gameQueryIsLoading || gameQueryIsFetching) {
    return <LoadingSpinner />
  }
  const renderGames = (
    <div className="p-5 flex flex-wrap justify-center items-center">
      {gameQuery.map((game) => (
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
      )
      )}
    </div>
  );

  return (
    <>
      <div className="flex">
        {renderGames}
      </div>
      <div className="flex w-40 mx-auto pagination justify-center items-center">
        <ResponsivePagination
          current={parseInt(searchParams.page)}
          total={pageCount}
          onPageChange={handlePageClick}
          maxVisiblePages={5}
        />
      </div>

    </>
  )

}