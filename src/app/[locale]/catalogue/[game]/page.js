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
export default function GamePage({ params }) {
    const [gameId, setGameId] = useState();
    const [artworks, setArtworks] = useState();
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
                body: `fields name, slug, cover.image_id; where slug="${gameSlug}";`
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
        }
    }, [data])

    if (isLoading || isFetching || otherDataIsLoading || otherDataIsFetching) {
        return <LoadingSpinner />
    }

    const gameName = otherGameData[0].name;
    const gameCover = otherGameData[0].cover.image_id;
    console.log("game cover", gameCover)
    const coverUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${gameCover}.jpg`
    return (
        <>
            <div className="game-container relative">
                <div className="game-screenshot-cont w-full h-80 flex justify-center items-center relative">
                    <img className="h-full w-full object-cover absolute" src={artworks}></img>
                    <h1 className="gameName z-50 text-slate-50 text-5xl">{gameName}</h1>
                </div>

                <div className="game-cover bottom:0 top-10 left-1/2 -translate-x-1/2 lg:-translate-x-0 right-0 mx-auto absolute lg:absolute lg:bottom-0 lg:top-20 lg:left-20 z-20">
                    <img src={coverUrl}></img>
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