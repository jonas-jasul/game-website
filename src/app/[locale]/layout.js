// 'use client';
import Navbar from './components/common/navbar';
import './globals.css'
// import { Rubik } from 'next/font/google'
// import Providers from './components/Themeprovider'
// import { themeChange } from 'theme-change';

import { notFound } from 'next/navigation';
import { NextIntlClientProvider } from 'next-intl';
import { AuthProvider } from './components/AuthProvider';
import HeadComponent from './head';
import ThemeProvider from './components/Themeprovider';
import Footer from './components/common/footer';
import createClient from './lib/supabase-server';
import QueryProviders from './utils/queryProvider';

function staticParams() {
  return [{ locale: 'en' }, { locale: 'lt' }];
}

export default async function RootLayout({ children, params: { locale } }) {

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
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

          <ThemeProvider>

            <AuthProvider>
            <QueryProviders>
              <Navbar user={user} />
              {children}
              </QueryProviders>
            </AuthProvider>

            <Footer />
          </ThemeProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

export const generateStaticParams = process.env.NODE_ENV === "production" ? staticParams : undefined;
export const dynamic = process.env.NODE_ENV === "production" ? 'auto' : 'force-dynamic';
