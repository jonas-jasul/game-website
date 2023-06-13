// "use client";
import Navbar from './components/navbar'
import './globals.css'
// import { Rubik } from 'next/font/google'
import Providers from './components/Themeprovider'
import Themechanger from './components/Themechanger'
import { themeChange } from 'theme-change';
// import { useEffect } from 'react';
// const rubik = Rubik({ subsets: ['latin'] })
// import { languages } from '../i18n/settings';
// import {useLocale} from 'next-intl';
import {notFound} from 'next/navigation';
import LayoutWrapper from './layoutWrapper';
import { NextIntlClientProvider } from 'next-intl';
import Head from './head';
import HeadComponent from './head';
// export async function generateStaticParams() {
//   return languages.map((lng) =>({lng}))
// }

export function generateStaticParams() {
  return [{locale: 'en'}, {locale: 'lt'}];
}

export default async function LocaleLayout({children, params:{locale}}) {  
  // const {locale} = params;

  
  let messages;
  try {
    messages = (await import(`../../../messages/${locale}.json`)).default;
  } catch (error) {
    notFound(); 
  }
 
  return (
    <html lang={locale}>
     <head>
            <HeadComponent />
            <title>Play Infinite</title>
            <link rel='icon' href='/favicon.ico' sizes='any'></link>
     </head>
      <body>  
      <NextIntlClientProvider locale={locale} messages={messages}>
        
          <Navbar>

          </Navbar>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
