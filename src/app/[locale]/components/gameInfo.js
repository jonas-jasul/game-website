// 'use client';
import "../css/gameInfo.css";
import { useQuery } from "@tanstack/react-query";
import StarRating from "./ui/starRating";
import { useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import Link from "next-intl/link";
import Image from "next/image";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { categoryMapper } from "../utils/gameCategoryHelper";
import Loading from "../catalogue/loading";


export default function GameInfo({ searchParams }) {
  const t = useTranslations('GameInfo');
  const router = useRouter();

  async function fetchGameData() {
    const pageSize = 20;

    const genreArr = await fetchGameGenres();

    function normalizeGenreNames(genre) {
      return genre.replace(/[^\w\s\/&'()\-\+]/g, "").replace(/\+/g, " ").toLowerCase();
    }


    console.log("genre param", searchParams.genre)
    const offset = ((searchParams.page || 1) - 1) * pageSize;


    const minRatings = searchParams.min_ratings ?? 25;


    let gameDataQuery = `fields id, name, total_rating, cover, genres, slug; where total_rating != null & total_rating_count >= ${minRatings}`;

    if (searchParams.search) {
      gameDataQuery += ` & name ~ *"${searchParams.search}"*`;
    }

    if (searchParams.genre) {
      const genreQuery = genreArr.find((genre) => genre.name === normalizeGenreNames(searchParams.genre));
      console.log("genre query", genreQuery);
      gameDataQuery += ` & genres = (${genreQuery.id})`;
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
    const gamesResponse = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/catalogue/games',
      {
        method: 'post',
        body: JSON.stringify({ gameDataQuery }),
      }
    );

    const dataGame = await gamesResponse.json();
    console.log(dataGame);
    const imageIds = dataGame.map((game) => game.id);
    console.log(imageIds);

    const imageIDsJoined = imageIds.join(',');
    const coversResponse = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/catalogue/gameCovers',
      {
        method: 'post',
        body: JSON.stringify({ imageIDsJoined, pageSize }),
      }
    );

    const dataImg = await coversResponse.json();
    console.log("dataImg", dataImg);
    const gamesWithCovers = await Promise.all(
      dataGame.map(async (game) => {
        const cover = dataImg.find((cover) => cover.game === game.id);
        const response = await fetch('/api/getBase64', {
          method: 'POST',
          body: JSON.stringify({
            url: `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`,
          }),
        });
        console.log("base 64 response", response)
        const base64 = await response.json();
        console.log('base64:', base64);

        return {
          id: game.id,
          name: game.name,
          slug: game.slug,
          rating: game.total_rating,
          coverUrl: cover && cover !== "null"
            ? `https://images.igdb.com/igdb/image/upload/t_cover_big/${cover.image_id}.jpg`
            : `https://images.igdb.com/igdb/image/upload/t_cover_big/nocover.png`,
          base64: base64,
        };
      })
    );
    console.log("games with covers", gamesWithCovers);
    return gamesWithCovers;
  }


  const { data: gameQuery, isFetching:gameQueryIsFetching } = useQuery({
    queryKey: ['games', searchParams.page, searchParams.genre, searchParams.category, searchParams.sort,
      searchParams.search, searchParams.min_ratings],
    queryFn: fetchGameData, refetchOnWindowFocus: false,
    keepPreviousData: true,
    suspense: true
  })

  if(gameQueryIsFetching) {
    return <Loading />
  }


  return (
    <>

      <div className="p-5 flex flex-wrap justify-center items-center">
        {gameQuery?.map((game) => (
          <div className="card lg:card-side bg-base-100 shadow-xl border border-primary lg:p-0 p-3" key={game.id}>
            <figure className="relative w-44 h-60 lg:h-60 lg:w-44">
              <Image fill src={game.coverUrl} style={{ objectFit: 'cover' }} placeholder="blur" blurDataURL={game.base64} alt="cover" />
            </figure>
            <div className="card-body p-2 pb-4 lg:p-6 w-60">
              <h2 className="card-title text-xl">{game.name}</h2>
              <p><StarRating starSize={20} rating={game.rating} /></p>
              <div className="card-actions justify-end">
                <Link href={`/catalogue/${game.slug}`} locale={router.locale} className="btn btn-primary">{t('moreInfoBtn')}</Link>
              </div>
            </div>
          </div>
        )
        )}
      </div>

    </>
  )

}

async function fetchGameGenres() {

  const genreResponse = await fetch(process.env.NEXT_PUBLIC_BASE_URL + '/api/catalogue/gameGenres', {
    method: 'POST',
  });

  if (!genreResponse.ok) {
    throw new Error("Failed to fetch");
  }

  const dataGenres = await genreResponse.json();
  console.log(dataGenres);
  const genreArr = dataGenres.map((game) => ({
    id: game.id,
    name: game.name.toLowerCase(),
  }));
  console.log("genre arr", genreArr);

  return genreArr;
}

