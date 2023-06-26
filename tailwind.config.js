/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  daisyui: {
    themes:
      ["cupcake", "cyberpunk", "lofi", "business", "pastel", "dracula", "halloween"],
    darkTheme: "business",
    darkMode: 'class',
    imortant: true,
    utils: true,
    base: true,
    styled: true,

  },

  plugins: [require('@tailwindcss/forms'), require("daisyui")],
}
