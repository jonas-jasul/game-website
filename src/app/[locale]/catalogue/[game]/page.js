"use client";
import { useRouter } from "next/navigation"
import { ClientID, Authorization } from "@/app/config";
import { useEffect, useRef, useState } from "react";
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
import moment from "moment";
import 'moment/locale/lt';

export default function GamePage({ params }) {
    // console.log('locale', params.locale);
    const currentLocale = params.locale;
    const shouldShowTranslateButton = currentLocale === 'lt';
    const [gameDescr, setGameDescrip] = useState('');
    const [translatedGameDescrip, setTranslatedGameDescrip] = useState('');
    const [artworks, setArtworks] = useState();
    const [isDivDark, setIsDivDark] = useState(false);
    const [gameId, setGameId] = useState();
    // const [gridColClass, setGridColClass] = useState();
    const t = useTranslations('GamePage');
    const t_g = useTranslations('Genres');
    const gameSlug = params?.game;


    function isDarkPlatfBackground(element) {
        if (element) {
            const bgColor = window.getComputedStyle(element).backgroundColor;

            const rgbVals = bgColor.match(/\d+/g).map((val) => parseInt(val));

            const luminance = (0.299 * rgbVals[0] + 0.587 * rgbVals[1] + 0.114 * rgbVals[2]) / 255;

            return luminance < 0.5;
        }
        else {
            return false;
        }
    }

    useEffect(() => {
        const checkPlatformDiv = () => {
            const platformDiv = document.querySelector('.platform-div');

            if (platformDiv) {
                console.log('platform div (dark)', platformDiv);
                const isDark = isDarkPlatfBackground(platformDiv);
                console.log('Is Dark?', isDark);
                setIsDivDark(isDark);
            } else {
                console.log('platform div (dark) not found');
                requestAnimationFrame(checkPlatformDiv)
            }
        }

        requestAnimationFrame(checkPlatformDiv);
    }, []);



    const fetchGame = async () => {
        const gameDataQuery = `fields id, name, rating, cover, genres, slug, summary, artworks, platforms, release_dates, screenshots;
         where slug = "${gameSlug}";`;
        const gamesResponse = await fetch(
            process.env.NEXT_PUBLIC_GAMES_FETCH,
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
        setGameId(screenshotId);
        console.log("dataGame", dataGame);
        console.log("screenshot ids", screenshotId);
        const screenshotQuery = await fetch(
            process.env.NEXT_PUBLIC_GAME_SCREENSHOT_FETCH,
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
            process.env.NEXT_PUBLIC_GAMES_FETCH,
            {
                method: 'post',
                headers: {
                    'Client-ID': ClientID,
                    'Authorization': Authorization,
                    'Accept': 'application/json',
                },
                body: `fields name, slug, rating, cover.image_id, summary, genres.name, genres.slug, first_release_date, platforms.name, platforms.platform_logo;
                 where slug="${gameSlug}";`
            }
        );
        const otherData = await otherDataQuery.json();
        return otherData;
    }
    const fetchGameCompanies = async () => {
        const companiesQuery = await fetch(process.env.NEXT_PUBLIC_GAME_INVOLVED_COMPANIES_FETCH,
            {
                method: 'post',
                headers: {
                    'Client-ID': ClientID,
                    'Authorization': Authorization,
                    'Accept': 'application/json',
                },
                body: `fields company, developer, game, porting, publisher, supporting, company.name; where game=${gameId};`
            })

        const companyData = await companiesQuery.json();
        return companyData;
    }

    const fetchGamePlatformLogos = async () => {

        const platformQuery = await fetch(process.env.NEXT_PUBLIC_GAME_PLATFORMS_FETCH,

            {
                method: 'post',
                headers: {
                    'Client-ID': ClientID,
                    'Authorization': Authorization,
                    'Accept': 'application/json',
                },
                body: `fields id, versions, abbreviation, name, platform_logo; limit 500;`
            })

        const platformData = await platformQuery.json();
        console.log("platform DATA", platformData);


        const platformLogosQuery = await fetch(process.env.NEXT_PUBLIC_GAME_PLATFORMS_LOGO_FETCH,
            {
                method: 'post',
                headers: {
                    'Client-ID': ClientID,
                    'Authorization': Authorization,
                    'Accept': 'application/json',
                },
                body: `fields id, image_id; limit 500;`
            })

        const platformLogoData = await platformLogosQuery.json();
        console.log("platformLogoData", platformLogoData);

        const platformsWithLogos = platformData.map((platform) => {
            const cover = platformLogoData.find((cover) => cover.id === platform.platform_logo);
            return {
                id: platform.id,
                name: platform.name,
                coverUrl: cover && cover !== "null"
                    ? `https://images.igdb.com/igdb/image/upload/t_logo_med/${cover.image_id}.png`
                    : null,
            };
        })
        return platformsWithLogos;
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

    const { data: companyData, isLoading: companyDataIsLoading, isFetching: companyDataIsFetching } = useQuery({
        queryKey: ['companyData', gameId],
        queryFn: fetchGameCompanies,
        refetchOnWindowFocus: false
    })
    console.log("company data", companyData);

    const { data: platformLogoData, isLoading: platformLogoIsLoading, isFetching: platformLogoIsFetching } = useQuery({
        queryKey: ['platformLogoData'],
        queryFn: fetchGamePlatformLogos,
        refetchOnWindowFocus: false
    })


    console.log("platform logo data RESULT  ", platformLogoData);

    useEffect(() => {
        if (data && otherGameData) {
            const _screenshot = data.map((screenshot) => screenshot.image_id);
            const _screenshotRand = _screenshot[Math.floor(Math.random() * _screenshot.length)];
            const screenshotUrl = `https://images.igdb.com/igdb/image/upload/t_1080p/${_screenshotRand}.jpg`;
            setArtworks(screenshotUrl)
            console.log("data id", gameId);
            console.log("otherGamedata", otherGameData);
            console.log("cover id");

            if (otherGameData) {
                const gameDescription = otherGameData[0].summary;
                setGameDescrip(gameDescription);
            }

        }
    }, [data, otherGameData, gameId]);




    if (isLoading || isFetching || otherDataIsLoading || otherDataIsFetching ||
        companyDataIsFetching || companyDataIsLoading || platformLogoIsLoading || platformLogoIsFetching) {
        return <LoadingSpinner />
    }


    const platformImageLookupTable = {
        "PC (Microsoft Windows)": "https://images.igdb.com/igdb/image/upload/t_logo_med/irwvwpl023f8y19tidgq.png",
        "PlayStation 5": "https://images.igdb.com/igdb/image/upload/t_logo_med/plcv.png",
        "Xbox Series X|S": "https://images.igdb.com/igdb/image/upload/t_logo_med/plfl.png",
        "Nintendo Switch": "https://images.igdb.com/igdb/image/upload/t_logo_med/pl6b.png",
        "PlayStation 4": "https://images.igdb.com/igdb/image/upload/t_logo_med/pl6e.png",
        "Xbox One": "https://images.igdb.com/igdb/image/upload/t_logo_med/pl6a.png",
        "Wii U": "https://upload.wikimedia.org/wikipedia/commons/3/35/Nintendo-Wii-U-Logo.png",
        "Nintendo 3DS": "https://images.igdb.com/igdb/image/upload/t_logo_med/pl6o.png",
        "PlayStation Vita": "https://images.igdb.com/igdb/image/upload/t_logo_med/pl6g.png",
        "Xbox 360": "https://images.igdb.com/igdb/image/upload/t_logo_med/pl6z.png",
        "PlayStation 3": "https://images.igdb.com/igdb/image/upload/t_logo_med/pl6m.png",
        "Wii": "https://upload.wikimedia.org/wikipedia/commons/1/1c/Wii_logo.png",
        "Nintendo DS": "https://images.igdb.com/igdb/image/upload/t_logo_med/pl6r.png",
        "PlayStation Portable": "https://images.igdb.com/igdb/image/upload/t_logo_med/pl6q.png",
        "Game Boy Advance": "https://images.igdb.com/igdb/image/upload/t_logo_med/pl73.png",
        "Android": "https://cdn-icons-png.flaticon.com/512/226/226770.png",
        "iOS": "https://www.freeiconspng.com/thumbs/ios-png/apple-ios-13.png",
        "Game Boy": "https://loodibee.com/wp-content/uploads/Nintendo_Game_Boy_Logo.png",
        "Nintendo Entertainment System": "https://www.vhv.rs/file/max/8/84136_nintendo-entertainment-system-logo-png.png",
        "Xbox": "https://logos-world.net/wp-content/uploads/2020/11/Xbox-Logo-2001-2005.png",
        "Nintendo 64": "https://cdn.freebiesupply.com/logos/large/2x/nintendo-64-2-logo-png-transparent.png",
        "Nintendo GameCube": "https://www.gran-turismo.com/gtsport/decal/7286850598806225936_1.png",
        "Super Nintendo Entertainment System": "https://upload.wikimedia.org/wikipedia/commons/thumb/2/2c/SNES_logo.svg/2560px-SNES_logo.svg.png",
        "Super Famicom": "https://upload.wikimedia.org/wikipedia/en/thumb/6/66/Super_Famicom_logo.svg/2560px-Super_Famicom_logo.svg.png",
        "New Nintendo 3DS": "https://upload.wikimedia.org/wikipedia/commons/thumb/b/be/New_Nintendo_3DS_logo.svg/2300px-New_Nintendo_3DS_logo.svg.png",
        "PlayStation": "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Playstation_logo_colour.svg/1200px-Playstation_logo_colour.svg.png",
        "Web browser": "https://upload.wikimedia.org/wikipedia/commons/2/26/Logo_Sitio_Web.png",
        "Mac": "https://upload.wikimedia.org/wikipedia/commons/thumb/3/30/MacOS_logo.svg/2048px-MacOS_logo.svg.png",
        "PlayStation 2": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/76/PlayStation_2_logo.svg/2560px-PlayStation_2_logo.svg.png",
        "Linux": "https://pngimg.com/d/linux_PNG1.png",
        "Satellaview": "https://upload.wikimedia.org/wikipedia/commons/thumb/c/cc/Satellaview_logo.svg/2560px-Satellaview_logo.svg.png",
        "SteamVR": "https://avatars.githubusercontent.com/u/79480697?s=280&v=4",
        "Oculus Rift": "https://1000logos.net/wp-content/uploads/2021/12/Oculus-Logo-2015.png",
        "Windows Mixed Reality": "https://cdn2.steamgriddb.com/file/sgdb-cdn/logo_thumb/6e04df31f1bbb1c02666d0dfa3638f76.png",
        "Dreamcast": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7e/Dreamcast_logo.svg/2560px-Dreamcast_logo.svg.png",
        "DOS": "https://raw.githubusercontent.com/Microsoft/MS-DOS/master/msdos-logo.png",
        "Amiga": "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e9/Amiga-Logo-1985.svg/2560px-Amiga-Logo-1985.svg.png",
        "Atari ST/STE": "https://www.atari-computermuseum.de/bilder/logos/atarist.png",
        "Sega Saturn": "https://loodibee.com/wp-content/uploads/Sega-Saturn-logo.png",
        "Arcade": "https://www.shareicon.net/data/512x512/2015/10/13/655635_arcade_512x512.png",
        "Sega Mega Drive/Genesis": "https://upload.wikimedia.org/wikipedia/commons/thumb/7/74/Sega_genesis_logo.svg/2560px-Sega_genesis_logo.svg.png"


    };

    const platformMapper = (platform) => {
        const _platformNames = platform.split(',');
        const platformDetails = _platformNames.map((name) => {
            const trimmedName = name.trim();
            return {
                name: trimmedName,
                image: platformImageLookupTable[trimmedName] || null
            };
        });
        return platformDetails
    }
    const platformsForGame = otherGameData[0].platforms;
    const platformNames = platformsForGame.map((platform) => platform.name);
    const mappedPlatformsForGame = platformNames.flatMap((platform) => platformMapper(platform));
    console.log("platform names", platformNames);
    console.log("mappedPlatforms", mappedPlatformsForGame);


    const currGamePlatforms = otherGameData[0].platforms;
    console.log("specific game platforms", currGamePlatforms);
    const mappedPlatforms = currGamePlatforms.map((platform) => platform.name);
    const filteredPlatforms = platformLogoData.filter((platform) => mappedPlatforms.includes(platform.name));
    console.log("effect filtered logos", filteredPlatforms)

    function getNumOfColsForPlatfGrid() {
        const totalItems = mappedPlatformsForGame.length;
        let cols;
        if (totalItems < 3) {
            cols = totalItems
        } else {
            cols = 3;
        }
        const gridClass = `grid lg:grid-cols-${cols}`;
        console.log("grid class", gridClass);

        return gridClass;
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
        const apiUrl = process.env.NEXT_PUBLIC_DEEPL_API_URL.toString() + `?auth_key=${DeepL_Key}&text=${encodeURIComponent(description)}&target_lang=lt`
        console.log("apie url", apiUrl)
        const response = await fetch(apiUrl);
        const data = await response.json();
        return data;
    }
    const handleTranslateButton = async () => {
        try {
            const response = await translateDescription(gameDescription);
            setTranslatedGameDescrip(response.translations[0].text);
            console.log("translated summary", translatedGameDescrip);
        } catch (error) {
            console.error("Error", error);
            alert("Pasiekta DeepL vertimų kvota. Bandykite vėliau")
        }
    }



    const gameReleaseDateUnix = otherGameData[0].first_release_date * 1000;
    moment.locale(currentLocale);
    const gameReleaseDate = moment(new Date(gameReleaseDateUnix)).format("MMMM Do, YYYY");
    const relativeReleaseDate = moment(gameReleaseDateUnix).fromNow();
    console.log("release date", gameReleaseDate);
    console.log("translated genres", translatedGenres);


    const gameDeveloperData = companyData?.find((data) => data.developer);
    console.log("game dev data", gameDeveloperData);
    const gameDevName = gameDeveloperData?.company.name;
    console.log("game developer name", gameDevName);

    const coverUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${gameCover}.jpg`
    return (
        <>
            <div className="game-container relative">
                <div className="game-screenshot-cont w-full left-0 h-80 flex justify-center items-center relative">
                    <img className="h-full w-full object-cover absolute" src={artworks}></img>
                </div>

                <div className="game-cover bottom-0 top-0 left-0 right-0 mx-auto absolute lg:absolute lg:bottom-0 lg:top-20 lg:left-32 lg:right-32">
                    <div className="flex flex-row lg:h-64">
                        <div className="game-cover-img mt-5 ml-4 mr-2 lg:ml-0 lg:mr-0 z-20">
                            <img className="w-48 h-64 lg:w-64 lg:h-auto" src={coverUrl}></img>
                            <div className="game-rating-cont bg-base-100 border border-primary p-2 rounded-md lg:flex lg:flex-col justify-center items-center w-full lg:w-60 hidden">
                                <h3 className="text-lg game-font" >{t('gamePageRatingTitle')}</h3>
                                <StarRating starSize={40} rating={gameRating} />
                                <span className="flex flex-row">{ratingColor(gameRatingRounded)} <h2 className="game-font">&nbsp;/ 100</h2></span>
                            </div>

                        </div>
                        <div className="game-name-cont w-40 lg:w-screen lg:h-32 mx-auto flex flex-col justify-center items-center">
                            <h1 className="gameName z-50 text-slate-50 text-3xl lg:text-5xl text-center game-font" >{gameName}</h1>
                            <div className="genre-pill-div flex flex-col lg:flex-row justify-center items-center max-w-full z-50">
                                {translatedGenres?.map((genre, index) => (
                                    <span key={index} className="badge badge-accent overflow-hidden text-center text-ellipsis max-w-[10em] h-auto lg:max-w-full mx-1 my-1 badge-lg font-bold z-50">{genre}</span>
                                ))}
                            </div>

                        </div>

                    </div>
                </div>
                <div className="hidden lg:flex lg:flex-row bg-base-200 mx-32 rounded-xl pb-3">
                    <div className="game-info-cont hidden lg:flex lg:flex-col lg:ml-64 lg:mt-3 z-40 lg:w-1/2 lg:mr-1 bg-base-200 rounded-2xl ">
                        <div className="upper-game-info border border-base-300 rounded-2xl z-40 mb-2 p-3 lg:w-full bg-accent">
                            <div className="game-release-date hidden lg:flex z-40">
                                <h4>{t('gamePageReleasedOn')} &nbsp;</h4>
                                <h2 className="text-xl text-accent-content font-semibold">{gameReleaseDate}</h2>
                                <h3>&nbsp;({relativeReleaseDate})</h3>
                            </div>
                            <div className="game-dev hidden lg:flex">
                                <h4 className="">{t('gamePageDevelopedBy')}&nbsp;</h4>
                                <h2 className="text-xl text-accent-content font-semibold">{gameDevName}</h2>
                            </div>
                        </div>
                        <div className="game-descrip hidden lg:flex lg:w-full ">
                            <div className="collapse collapse-arrow border border-base-300 bg-base-100">
                                <input type="checkbox" className="w-full h-full" />
                                <div className="collapse-title text-xl font-medium">
                                    {t('gamePageDescTitle')}
                                </div>
                                <div className="collapse-content">
                                    {shouldShowTranslateButton && <button className="btn btn-secondary btn-sm" disabled={translatedGameDescrip !== ''} onClick={handleTranslateButton}>Išversti</button>}
                                    <p>{translatedGameDescrip || gameDescription}</p>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div className="mx-auto z-40 hidden lg:flex lg:flex-col">
                        <div className="platform-div mx-auto border border-primary rounded-lg p-2 mt-3 bg-base-200">
                            <h4 className="text-center text-xl flex justify-center items-center mb-0 font-semibold text-base-content">{t('gamePagePlatformsH')}</h4>
                            <div className="divider mt-1"></div>

                            <div className={`game-platforms grid ${getNumOfColsForPlatfGrid()} z-40 justify-center gap-2 items-center `} >
                                {mappedPlatformsForGame.map((platform, index) => (
                                    <div className="platform z-40 w-20" key={index}>
                                        <img className="object-contain" src={platform.image} />
                                    </div>
                                )
                                )}
                            </div>
                        </div>
                    </div>

                </div>




                {/* Mobile layout */}

                <div className="game-description-cont flex flex-col lg:hidden">
                    <div className="game-rating-cont bg-base-200 p-2 rounded-md flex flex-col lg:hidden justify-center items-center w-full lg:w-60">
                        <h3 className="text-lg game-font" >{t('gamePageRatingTitle')}:</h3>
                        <StarRating starSize={40} rating={gameRating} />
                        <span className="flex flex-row">{ratingColor(gameRatingRounded)} <h2 className="game-font">&nbsp;/ 100</h2></span>
                    </div>

                    <div className="upper-game-info border flex flex-col justify-center items-center border-base-300 bg-accent rounded-lg z-40 mb-2 p-1 w-full">
                        <div className="game-release-date flex flex-col lg:hidden z-40">
                            <div>
                                <h4 className="text-center">{t('gamePageReleasedOn')}</h4>
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold">{gameReleaseDate}</h2>
                                <h3 className="text-center">&nbsp;({relativeReleaseDate})</h3>
                            </div>

                        </div>

                        <div className="game-dev flex flex-col lg:hidden mt-3 ">
                            <div>
                                <h4 className="text-center">{t('gamePageDevelopedBy')}&nbsp;</h4>
                            </div>
                            <div>
                                <h2 className="text-xl text-center font-semibold">{gameDevName}</h2>
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-row my-2">
                        <div className="platform-heading flex justify-center items-center">
                            <h2 className="text-xl font-semibold ml-3">{t('gamePagePlatformsH')}</h2>
                            <div className="divider divider-horizontal"></div>

                        </div>
                        <div className={`game-platforms lg:hidden grid grid-cols-2 z-40 justify-center items-center mx-auto`} >
                            {mappedPlatformsForGame.map((platform, index) => (
                                <div className="platform z-40 w-16 m-1">
                                    <img className="object-contain" key={index} src={platform.image} />
                                </div>
                            )
                            )}
                        </div>
                    </div>



                    <div className="game-descrip">
                        <div tabIndex={0} className="collapse collapse-arrow border border-base-300 bg-base-200">
                            <input type="checkbox" className="w-full h-full" />

                            <div className="collapse-title text-xl font-medium">
                                {t('gamePageDescTitle')}
                            </div>
                            <div className="collapse-content">
                                {shouldShowTranslateButton && <button className="btn btn-secondary btn-sm" disabled={translatedGameDescrip !== ''} onClick={handleTranslateButton}>Išversti</button>}

                                <p>{translatedGameDescrip || gameDescription}</p>
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