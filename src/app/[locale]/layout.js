import Navbar from './components/common/navbar'
import './globals.css'
// import { Rubik } from 'next/font/google'
import Providers from './components/Themeprovider'
import { themeChange } from 'theme-change';

import { notFound } from 'next/navigation';
import LayoutWrapper from './layoutWrapper';
import { NextIntlClientProvider } from 'next-intl';
import Head from './head';
import { AuthProvider } from './components/AuthProvider';
import HeadComponent from './head';
import ThemeProvider from './components/Themeprovider';


export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'lt' }];
}

export default async function RootLayout({ children, params: { locale } }) {

  let messages;
  try {
    messages = (await import(`/messages/${locale}.json`)).default;
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

          <ThemeProvider>
            
            <AuthProvider>
            <Navbar />
              {children}
            </AuthProvider>


          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
