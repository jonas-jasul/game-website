// "use client";
// import { useEffect } from "react";
// import { themeChange } from "theme-change";
// const ThemeProvider = ({ children }) => {
//     useEffect(() => {
//         themeChange(true);
//     }, [themeChange]);

//     return children
// }

// export default ThemeProvider;
"use client";

import { ThemeProvider } from 'next-themes'

export default function Providers({ children }) {
  return <ThemeProvider>{children}</ThemeProvider>
}