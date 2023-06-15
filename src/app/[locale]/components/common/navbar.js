"use client";
import React from "react";
// import Link from "next/link";
import Link from "next-intl/link";
import { useRouter } from "next/navigation";
import { Rubik } from "next/font/google";
import ThemeSwitcher from "../ui/themeSwitcher";
import LangToggler from "../ui/langToggler";
import Image from "next/image";
import { useTranslations } from "next-intl";
import Avatar from "../ui/avatar";


const rubik = Rubik({ subsets: ['latin'] })
const Navbar = () => {
    const router = useRouter();
    const t = useTranslations('Navbar');
    return (
        <main className={rubik.className}>
            <div className="navbar bg-primary h-20 lg:h-auto">
                <div className="navbar-start">
                    <div className="dropdown">
                        <label tabIndex={0} className="btn btn-ghost lg:hidden">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h8m-8 6h16" /></svg>
                        </label>
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52" style={{ zIndex: 3 }} >
                            <li><Link href="/catalogue" locale={router.locale}>{t('catalogue')}</Link></li>
                            <li>
                                <a>Parent</a>
                                <ul className="p-2">
                                    <li><a>Submenu 1</a></li>
                                    <li><a>Submenu 2</a></li>
                                </ul>
                            </li>
                            <li className="my-1"><LangToggler /></li>
                            <li><ThemeSwitcher /></li>
                            <li><a>Item</a></li>
                        </ul>
                    </div>
                    <Link href="/" locale={router.locale} className="btn btn-ghost normal-case text-xl">
                        <div className="flex items-center justify-center">
                            <Image src="/../public/playInfiniteTransparent(cropped).png" height={105} width={105} alt="Play Infinite" />
                        </div>
                    </Link>
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link href="/catalogue" locale={router.locale}>{t('catalogue')}</Link></li>
                        <li tabIndex={0}>

                        </li>
                        <li><a>Item</a></li>
                    </ul>
                </div>

                <div className="navbar-end hidden lg:flex">

                    <Avatar />

                    <LangToggler />

                    <ThemeSwitcher />

                </div>

            </div>
        </main>
    );
};
export default Navbar;