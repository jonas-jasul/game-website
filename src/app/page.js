import Footer from "./components/footer";

export default function Home() {
  return (
    <>
      <div className="hero min-h-screen" style={{ backgroundImage: "url(https://whatifgaming.com/wp-content/uploads/2022/05/Night-City-Wallpaper-scaled.jpg)" }}>
        <div className="hero-overlay bg-opacity-70"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">Game on!</h1>
            <p className="mb-5">Welcome to my website! Here you can check your favorite video games and more!</p>
            <a href="./catalogue"><button className="btn btn-primary">Begin</button></a>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
}
