import React from "react";
import Link from "next/link";
import { Rubik } from "next/font/google";
import Themechanger from "./Themechanger";
const rubik = Rubik({ subsets: ['latin'] })
const Navbar = () => {
    return (
        <main className={rubik.className}>
            <nav className="bg-slate-400 w-full flex flex-wrap justify-between p-4 items-center">
                <div className="container mx-auto flex flex-wrap items-center justify-between">

                    <Link href="/" className="flex items-center">LOGO</Link>

                    <div className="flex justify-end">
                        <Link href="./catalogue" className="mx-3">Catalogue</Link>
                        <a href="" className="mx-3">x</a>
                        <Themechanger />
                    </div>
                </div>
            </nav>
        </main>
    );
};
export default Navbar;