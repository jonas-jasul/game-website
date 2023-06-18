"use client";
import { useRouter } from "next/navigation"
import { ClientID, Authorization } from "@/app/config";
import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import 'swiper/css';
import "swiper/css/pagination";
import { Autoplay, Pagination, Navigation } from "swiper";

export default function GamePage({ params }) {
    const [gameId, setGameId] = useState();
    const [artworksId, setArtworksId] = useState();
    const gameSlug = params?.game;
    const fetchGame = async () => {
        const gameDataQuery = `fields id, name, rating, cover, genres, slug, summary, artworks, platforms, release_dates;
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
        //probably not necessary
        // const _gameId=dataGame.find((game)=>game)?.id;
        // console.log("game id", _gameId)
        // setGameId(_gameId);

        const _artworkId=dataGame.map((game)=>game.artworks);
        console.log("artwork ids", _artworkId);
        console.log(dataGame);
    }

    // const fetchArtwork = async ()={

    // }


    useEffect(() => {
        fetchGame();
    }, [gameSlug]);

    return (
        <>
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
            ID: {gameSlug}
        </>



    )
}