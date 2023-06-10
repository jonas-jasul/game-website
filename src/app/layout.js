"use client";
import Navbar from './components/navbar'
import './globals.css'
// import { Rubik } from 'next/font/google'
import Providers from './components/Themeprovider'
import Themechanger from './components/Themechanger'
import { themeChange } from 'theme-change';
import { useEffect } from 'react';
// const rubik = Rubik({ subsets: ['latin'] })


export default function RootLayout({ children }) {


  useEffect(() => {
    if (typeof exports != "undefined") {
      module.exports = {
        themeChange: themeChange
      }
    } else {
      var selectedTheme = localStorage.getItem("theme");
      if (selectedTheme) {
        document.documentElement.setAttribute("data-theme", selectedTheme);
      }
      themeChange(true);
    }
  })
  return (
    <html lang="en">
      <head>
        <script async src="https://cdn.jsdelivr.net/npm/theme-change@2.0.2/index.js"></script>

        <title>Game Website</title>
      </head>
      <body>
        <Providers>
          <Navbar>

          </Navbar>
          {children}
        </Providers>
      </body>
    </html>
  )
}
