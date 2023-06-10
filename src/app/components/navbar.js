import React from "react";
import Link from "next/link";
import { Rubik } from "next/font/google";
import Themechanger from "./Themechanger";
import ThemeSwitcher from "./themeSwitcher";
const rubik = Rubik({ subsets: ['latin'] })
const Navbar = () => {
    return (
        <main className={rubik.className}>
            <div className="navbar bg-primary">
                <div className="navbar-start">
                    <div className="dropdown" style={{zIndex:1}}>
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52">
                            <li><a href="./catalogue">Catalogue</a></li>
                            <li>
                                <a>Parent</a>
                                <ul className="p-2">
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </li>
                            <li><a>Item</a></li>
                        </ul>
                    </div>
                    <a href="/" className="btn btn-ghost normal-case text-xl">Game Website</a>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><a href="./catalogue">Catalogue</a></li>
                        <li tabIndex={0}>
                           
                        </li>
                        <li><a>Item</a></li>
                    </ul>
                </div>
                <div className="navbar-end">
                <ThemeSwitcher />
                </div>
            </div>
        </main>
    );
};
export default Navbar;