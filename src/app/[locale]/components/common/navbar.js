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
import { useState, useEffect } from "react";
import Avatar from "../ui/avatar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { createClient } from "@supabase/supabase-js";
import { createPagesBrowserClient } from "@supabase/auth-helpers-nextjs";
const rubik = Rubik({ subsets: ['latin'] })
const Navbar = ({ user }) => {

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
                        <ul tabIndex={0} className="menu menu-sm dropdown-content mt-3 p-2 shadow bg-base-100 rounded-box w-52 z-50" >
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
                            <Image src="/static/img/playInfiniteTransparent(cropped).png" height={90} width={90} alt="Play Infinite" />
                        </div>
                    </Link>
                </div>
                <div className="flex ml-auto justify-end items-end lg:hidden">
                    <Avatar user={user} />
                </div>
                <div className="navbar-center hidden lg:flex">
                    <ul className="menu menu-horizontal px-1">
                        <li><Link href="/catalogue" className="font-semibold text-primary-content hover:text-primary-content focus:text-primary-content" locale={router.locale}>{t('catalogue')}</Link></li>
                        <li tabIndex={0}>

                        </li>
                        <li><Link href="" className="font-semibold text-primary-content hover:text-primary-content focus:text-primary-content">Item</Link></li>
                    </ul>
                </div>

                <div className="navbar-end hidden lg:flex">

                    <Avatar user={user} />

                    <LangToggler />

                    <ThemeSwitcher />

                </div>

            </div>
        </main>
    );
};
export default Navbar;