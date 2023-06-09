
import { BsGithub } from "react-icons/bs"
import { BsLinkedin } from "react-icons/bs"
export default function Footer() {
    return (
        <div className="footer-cont sticky top-[100vh] p-2 bg-slate-400 mt-1 " style={{ fontFamily: 'Rajdhani, sans-serif' }}>
            <div className="footer flex justify-center items-center">
                <>Jonas Jasulevičius</>
            </div>
            <div className="flex justify-center items-center">
                <button className="m-1">
                    <span>
                        <a href="https://github.com/jonas-jasul"><BsGithub size='1.7rem' /></a>
                    </span>
                </button>
                <button>
                    <a href="https://www.linkedin.com/in/jonas-jasulevicius-648177211/">
                        <BsLinkedin size='1.7rem' />
                    </a>
                </button>
            </div>

            <div className="flex justify-center items-center">
                <>API provided by <a className="mx-1 font-bold" href="https://www.igdb.com/">IGDB</a> </>
            </div>
        </div>
    )
}