'use client';
import { useEffect, useRef, useState } from "react";
import LoadingSpinner from "./common/loadingSpinner";
// import { ClientID, Authorization } from "../../config";
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
import Link from "next/link";
import { RxArrowLeft, RxArrowRight } from "react-icons/rx";
import { dropEllipsisThenNav, dropEllipsis } from "react-responsive-pagination/narrowBehaviour";
import Image from "next/image";
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
  }, [searchParams.page, searchParams.genre, pathname, router]);


  const handlePageClick = (data) => {
    const current = new URLSearchParams(searchParams);
    current.set("page", data);
    const pageStr = current.toString();
    const query = pageStr ? `?${pageStr}` : "";
    router.push(`${pathname}${query}`);
    // setPageNumber(data);
  }

  async function fetchGameGenres() {
    const genreResponse = await fetch(process.env.NEXT_PUBLIC_GAMES_GENRES_FETCH, {
      method: 'post',
      headers: {
        'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID,
        'Authorization': process.env.NEXT_PUBLIC_AUTHORIZATION,
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

  const categoryLookupTable = {
    "main game": 0,
    'dlc / add-on': 1,
    'expansion': 2,
    'bundle': 3,
    'standalone expansion': 4,
    'mod': 5,
    'episode': 6,
    'season': 7,
    'remake': 8,
    'remaster': 9,
    'expanded game': 10,
    'port': 11,
    'fork': 12,
    'pack': 13,
    'update': 14,
  };



  const categoryMapper = (category) => categoryLookupTable[category];
  const fetchTotalGameCount = async () => {

    const genreArr = await fetchGameGenres();
    const minRating = searchParams.min_ratings ?? 25;
    let countQuery = `where total_rating_count>=${minRating}`;

    if (searchParams.genre) {
      const genreQuery = genreArr.find((genre) => genre.name === searchParams.genre);

      countQuery += ` & genres = ${genreQuery.id}`;
    }

    if (searchParams.category) {
      countQuery += ` & category = ${categoryMapper(searchParams.category)}`
    }

    if (searchTerm) {
      countQuery += ` & name ~ *"${searchTerm}"*`;
    }

    countQuery += ';';

    const countResponse = await fetch(process.env.NEXT_PUBLIC_GAMES_COUNT_FETCH, {
      method: 'post',
      headers: {
        'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID,
        'Authorization': process.env.NEXT_PUBLIC_AUTHORIZATION,
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
  }, [searchParams.search, searchParams.genre, searchParams.category, searchParams.page, searchParams.min_ratings]);


  async function fetchGameData() {
    const genreArr = await fetchGameGenres();

    console.log("genre param", searchParams.genre)
    const offset = (searchParams.page - 1) * pageSize


    const minRatings = searchParams.min_ratings ?? 25;


    let gameDataQuery = `fields id, name, total_rating, cover, genres, slug; where total_rating != null & total_rating_count >= ${minRatings}`;

    if (searchParams.search) {
      gameDataQuery += ` & name ~ *"${searchParams.search}"*`;
    }

    if (searchParams.genre) {
      const genreQuery = genreArr.find((genre) => genre.name === searchParams.genre);
      console.log("genre query", genreQuery);
      gameDataQuery += ` & genres = ${genreQuery.id}`;
    }

    if (searchParams.category) {
      console.log('categ from ulr', searchParams.category);
      const mappedCategory = categoryMapper(searchParams.category)
      gameDataQuery += ` & category = '${mappedCategory}' `;
      console.log('game cateogry', mappedCategory);
    }

    if (searchParams.sort) {
      gameDataQuery += `; sort ${searchParams.sort} desc`;
    } else {
      gameDataQuery += `; sort total_rating desc`
    }

    gameDataQuery += `; limit ${pageSize}; offset ${offset};`;
    console.log("offset", offset)
    console.log(gameDataQuery);
    const gamesResponse = await fetch(process.env.NEXT_PUBLIC_GAMES_FETCH,
      {
        method: 'post',
        headers: {
          'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID,
          'Authorization': process.env.NEXT_PUBLIC_AUTHORIZATION,
          'Accept': 'application/json',
        },
        body: gameDataQuery,
      }
    );

    const dataGame = await gamesResponse.json();
    console.log(dataGame);
    const imageIds = dataGame.map((game) => game.id);
    console.log(imageIds);

    const coversResponse = await fetch(process.env.NEXT_PUBLIC_GAMES_COVERS_FETCH,
      {
        method: 'post',
        headers: {
          'Client-ID': process.env.NEXT_PUBLIC_CLIENT_ID,
          'Authorization': process.env.NEXT_PUBLIC_AUTHORIZATION,
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
        rating: game.total_rating,
        coverUrl: cover && cover !== "null"
          ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`
          : `https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png`,
      };
    });
    console.log("games with covers", gamesWithCovers);
    return gamesWithCovers;
  }

  const { data: gameQuery, isLoading: gameQueryIsLoading, isFetching: gameQueryIsFetching, refetch: gameRefetch } = useQuery({
    queryKey: ['games', searchParams.page, searchParams.genre, searchParams.category, searchParams.sort,
      searchParams.search, searchParams.min_ratings],
    queryFn: fetchGameData, refetchOnWindowFocus: false
  })

  const customPageRef = useRef(null);

  function setCustomPageNr() {
    const url = new URLSearchParams(searchParams);
    url.set("page", parseInt(customPageRef.current.value));
    const urlStr = url.toString();
    router.push(`${pathname}?${urlStr}`)
  }

  if (gameQueryIsLoading || gameQueryIsFetching) {
    return <LoadingSpinner />
  }
  const renderGames = (
    <div className="p-5 flex flex-wrap justify-center items-center">
      {gameQuery.map((game) => (
        <div className="card lg:card-side bg-base-100 shadow-xl border border-primary p-0" key={game.id}>
          <figure className="relative w-60 h-72 lg:h-60 lg:w-44">
            <Image fill src={game.coverUrl} style={{ objectFit: 'cover' }} alt="cover" />
          </figure>
          <div className="card-body w-60">
            <h2 className="card-title text-xl">{game.name}</h2>
            <p><StarRating starSize={20} rating={game.rating} /></p>
            <div className="card-actions justify-end">
              <Link href={`/catalogue/${game.slug}`} className="btn btn-primary">{t('moreInfoBtn')}</Link>
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
      <div className="flex flex-col mx-auto pagination justify-center items-center w-full lg:w-1/2">
        <ResponsivePagination
          current={parseInt(searchParams.page)}
          total={pageCount}
          onPageChange={handlePageClick}
          nextLabel={<RxArrowRight className="h-6" />}
          previousLabel={<RxArrowLeft className="h-6" />}
          narrowBehaviour={dropEllipsisThenNav}
        />
        <div className="form-control ml-4 mt-2">
          <div className="input-group">
            <input type="number" placeholder={t('customPagePlaceholder')} ref={customPageRef} className="input input-bordered border-primary w-20" />
            <button className="btn btn-square border-primary" onClick={setCustomPageNr}>
              {t('customPageGo')}
            </button>
          </div>
        </div>
      </div>

    </>
  )

}