"use client";
import { useRouter } from "next/navigation"
import { ClientID, Authorization } from "@/app/config";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import "swiper/css/pagination";
import { Autoplay, Pagination, Navigation } from "swiper";
import "../../css/gamePage.css";
import { useQuery } from "@tanstack/react-query";
import LoadingSpinner from "../../components/common/loadingSpinner";
import StarRating from "../../components/ui/starRating";
import { useTranslations } from "next-intl";
import { DeepL_Key } from "@/app/config";
export default function GamePage({ params }) {
    // console.log('locale', params.locale);
    const currentLocale = params.locale;
    const shouldShowTranslateButton = currentLocale === 'lt';
    const [gameDescr, setGameDescrip] = useState('');
    const [translatedGameDescrip, setTranslatedGameDescrip] = useState('');
    const [isTranslated, setIsTranslated] = useState('false');
    const [artworks, setArtworks] = useState();
    const t = useTranslations('GamePage');
    const t_g = useTranslations('Genres');
    const gameSlug = params?.game;
    const fetchGame = async () => {
        const gameDataQuery = `fields id, name, rating, cover, genres, slug, summary, artworks, platforms, release_dates, screenshots;
         where slug = "${gameSlug}";`;
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

        const screenshotId = dataGame.map((game) => game.id);
        console.log("dataGame", dataGame);
        console.log("screenshot ids", screenshotId);
        const screenshotQuery = await fetch(
            'http://localhost:8080/https://api.igdb.com/v4/screenshots',
            {
                method: 'post',
                headers: {
                    'Client-ID': ClientID,
                    'Authorization': Authorization,
                    'Accept': 'application/json',
                },
                body: `fields game, image_id; where game=${screenshotId};`
            }
        );

        const screenshots = await screenshotQuery.json();
        // const imageIds=screenshots.map((screenshot)=>screenshot.image_id);
        return screenshots;
    }

    const fetchOtherGameData = async () => {
        const otherDataQuery = await fetch(
            'http://localhost:8080/https://api.igdb.com/v4/games',
            {
                method: 'post',
                headers: {
                    'Client-ID': ClientID,
                    'Authorization': Authorization,
                    'Accept': 'application/json',
                },
                body: `fields name, slug, rating, cover.image_id, summary, genres.name, genres.slug ;
                 where slug="${gameSlug}";`
            }
        );
        const otherData = await otherDataQuery.json();
        return otherData;
    }

    const { data, isLoading, isFetching } = useQuery({
        queryKey: ['gamePageData', gameSlug],
        queryFn: fetchGame,
        refetchOnWindowFocus: false
    })
    const screenshotResult = data;
    console.log("screenshot result", screenshotResult);

    const { data: otherGameData, isLoading: otherDataIsLoading, isFetching: otherDataIsFetching } = useQuery({
        queryKey: ['otherGameData', gameSlug],
        queryFn: fetchOtherGameData,
        refetchOnWindowFocus: false
    })

    useEffect(() => {
        if (data) {
            const _screenshot = data.map((screenshot) => screenshot.image_id);
            const _screenshotRand = _screenshot[Math.floor(Math.random() * _screenshot.length)];
            const screenshotUrl = `https://images.igdb.com/igdb/image/upload/t_1080p/${_screenshotRand}.jpg`;
            setArtworks(screenshotUrl)
            console.log("otherGamedata", otherGameData);
            console.log("cover id");

            if(otherGameData) {
                const gameDescription = otherGameData[0].summary;
                    setGameDescrip(gameDescription);

            }
        }
    }, [data, otherGameData]);

    if (isLoading || isFetching || otherDataIsLoading || otherDataIsFetching) {
        return <LoadingSpinner />
    }

    const gameName = otherGameData[0].name;
    const gameCover = otherGameData[0].cover?.image_id;
    console.log("game cover", gameCover)
    const gameRating = otherGameData[0].rating;
    console.log('game rating', gameRating);
    const gameRatingRounded = Math.round(gameRating * 100) / 100;

    function ratingColor(gameRatingRounded) {
        if (gameRatingRounded >= 70) {
            return (
                <h3 className="game-font font-bold" style={{ color: 'green' }}>{gameRatingRounded}</h3>
            );
        } else if (gameRatingRounded >= 50) {
            return (
                <h3 className="game-font font-bold" style={{ color: 'orange' }}>{gameRatingRounded}</h3>
            );
        } else {
            return (
                <h3 className="game-font font-bold" style={{ color: 'red' }}>{gameRatingRounded}</h3>
            );
        }
    }
    const gameDescription = otherGameData[0].summary;
    const gameGenres = otherGameData[0].genres?.map((genre) => ({ id: genre.id, name: genre.name, slug: genre.slug }));
    console.log("game genres", gameGenres);
    console.log("other game data", otherGameData);
    // const translatedGenres = gameGenres.map((genre) => t_g[genre.slug] || genre.name);
    const translatedGenres = gameGenres?.map((genre) => {
        const _genre = genre.slug;
        console.log('genre.slug:', _genre);
        console.log('t_g[genre.slug]:', t_g(`${_genre}`));
        return t_g(`${_genre}`) || genre.name;
    });


    const translateDescription = async (description) => {
        const apiUrl = `http://localhost:8080/https://api-free.deepl.com/v2/translate?auth_key=${DeepL_Key}&text=${encodeURIComponent(description)}&target_lang=lt`;
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    }
    const handleTranslateButton = async() => {
        try {
            const response =await translateDescription(gameDescription);
            setTranslatedGameDescrip(response.translations[0].text);
            setIsTranslated(true);
            console.log("translated summary", translatedGameDescrip);
        } catch (error) {
            console.error("Error", error);
            alert("Pasiekta DeepL vertimų kvota. Bandykite vėliau")
        }
    }

   

    console.log("translated genres", translatedGenres);
    const coverUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${gameCover}.jpg`
    return (
        <>
            <div className="game-container relative">
                <div className="game-screenshot-cont w-full left-0 h-80 flex justify-center items-center relative">
                    <img className="h-full w-full object-cover absolute" src={artworks}></img>
                </div>

                <div className="game-cover bottom-0 top-0 left-0 right-0 mx-auto absolute lg:absolute lg:bottom-0 lg:top-20 lg:left-10 lg:right-10 h-auto">
                    <div className="flex flex-row lg:h-64">
                        <div className="game-cover-img mt-5 ml-4 mr-2 lg:ml-0 lg:mr-0 z-20">
                            <img className="w-48 h-64 lg:w-64 lg:h-auto" src={coverUrl}></img>
                            <div className="game-rating-cont bg-base-200 p-2 rounded-md lg:flex lg:flex-col justify-center items-center w-full lg:w-60 hidden">
                                <h3 className="text-lg game-font" >{t('gamePageRatingTitle')}</h3>
                                <StarRating starSize={40} rating={gameRating} />
                                <span className="flex flex-row">{ratingColor(gameRatingRounded)} <h2 className="game-font">&nbsp;/ 100</h2></span>
                            </div>

                        </div>
                        <div className="game-name-cont w-40 lg:w-screen lg:h-32 mx-auto flex flex-col justify-center items-center">
                            <h1 className="gameName z-50 text-slate-50 text-3xl lg:text-5xl text-center game-font" >{gameName}</h1>
                            <div className="genre-pill-div flex flex-col lg:flex-row justify-center items-center max-w-full z-50">
                                {translatedGenres?.map((genre) => (
                                    <span className="badge badge-accent overflow-hidden text-center text-ellipsis max-w-[10em] h-auto lg:max-w-full mx-1 my-1 badge-lg font-bold z-50">{genre}</span>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>
                <div className="game-info-cont lg:flex lg:flex-col lg:ml-72 lg:mt-2 z-40 lg:mr-10 ">
                    <div className="game-descrip hidden lg:flex lg:w-96 ">
                        <div className="collapse collapse-arrow border border-base-300 bg-base-200">
                            <input type="checkbox" className="w-full h-full" />
                            <div className="collapse-title text-xl font-medium">
                                {t('gamePageDescTitle')}
                            </div>
                            <div className="collapse-content">
                            {shouldShowTranslateButton && <button className="btn btn-secondary btn-sm" disabled={translatedGameDescrip!==''} onClick={handleTranslateButton}>Išversti</button>}
                                <p>{translatedGameDescrip || gameDescription}</p>
                            </div>
                        </div>

                    </div>
                </div>


                <div className="game-description-cont flex flex-col lg:hidden">
                    <div className="game-rating-cont bg-base-200 p-2 rounded-md flex flex-col lg:hidden justify-center items-center w-full lg:w-60">
                        <h3 className="text-lg game-font" >{t('gamePageRatingTitle')}:</h3>
                        <StarRating starSize={40} rating={gameRating} />
                        <span className="flex flex-row">{ratingColor(gameRatingRounded)} <h2 className="game-font">&nbsp;/ 100</h2></span>
                    </div>

                    <div className="game-descrip">
                        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200">
                            <input type="checkbox" className="w-full h-full" />

                            <div className="collapse-title text-xl font-medium">
                                {t('gamePageDescTitle')}
                            </div>
                            <div className="collapse-content">
                            {shouldShowTranslateButton && <button className="btn btn-secondary btn-sm" disabled={translatedGameDescrip!==''} onClick={handleTranslateButton}>Išversti</button>}

                                <p>{ translatedGameDescrip || gameDescription}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* <Swiper
                centeredSlides={true}
                pagination={{
                    dynamicBullets: true,
                }}
                modules={[Autoplay, Pagination, Navigation]}
                className="mySwiper h-40"
                autoplay={{
                    delay: 3000,
                    disableOnInteraction: false
                }}
            >
                <SwiperSlide>Slide 1</SwiperSlide>
                <SwiperSlide>Slide 2</SwiperSlide>
                <SwiperSlide>Slide 3</SwiperSlide>
                <SwiperSlide>Slide 4</SwiperSlide>
                <SwiperSlide>Slide 5</SwiperSlide>
                <SwiperSlide>Slide 6</SwiperSlide>
                <SwiperSlide>Slide 7</SwiperSlide>
                <SwiperSlide>Slide 8</SwiperSlide>
                <SwiperSlide>Slide 9</SwiperSlide>
            </Swiper> */}
        </>



    )
}