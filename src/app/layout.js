import Navbar from './components/navbar'
import './globals.css'
// import { Rubik } from 'next/font/google'
import Providers from './components/Themeprovider'
import Themechanger from './components/Themechanger'
// const rubik = Rubik({ subsets: ['latin'] })


export default function RootLayout({ children }) {
  return (
    <html lang="en">
    <head>
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
