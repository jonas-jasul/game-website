import Game from "../components/game"
import Footer from "../components/common/footer"
export default function Page({searchParams}) {
    return (
        <>
        <Game searchParams={searchParams} ></Game>
        
        </>
    )
}