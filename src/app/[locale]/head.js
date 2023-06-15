"use client";
import Head from "next/head";
import { useEffect } from "react";
import { themeChange } from 'theme-change';

export default function HeadComponent() {

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
      },[])
    return (
        
      <script async src="https://cdn.jsdelivr.net/npm/theme-change@2.0.2/index.js"></script>
        
    )
}