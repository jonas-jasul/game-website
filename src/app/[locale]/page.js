'use client';
import { redirect, useRouter } from "next/navigation";
import Footer from "./components/common/footer";
import { useTranslations } from "next-intl";
import Link from "next-intl/link";
import { useEffect } from "react";
import Auth from "./components/auth";
import { useAuth, VIEWS } from "./components/AuthProvider";
// import {usePathname} from 'next-intl/client';

export default function Home() {
  const t = useTranslations('Index');
  const router =useRouter();
  return (
    <>
      <div className="hero min-h-screen" style={{ backgroundImage: "url(https://whatifgaming.com/wp-content/uploads/2022/05/Night-City-Wallpaper-scaled.jpg)" }}>
        <div className="hero-overlay bg-opacity-70"></div>
        <div className="hero-content text-center text-neutral-content">
          <div className="max-w-md">
            <h1 className="mb-5 text-5xl font-bold">{t('heroGameOn')}</h1>
            <p className="mb-5">{t('heroDesc')}</p>
            <Link href="/catalogue" locale={router.locale}><button className="btn btn-primary">{t('heroBegin')}</button></Link>
          </div>
        </div>
      </div>

      <Footer />
    </>
  )
  
}
