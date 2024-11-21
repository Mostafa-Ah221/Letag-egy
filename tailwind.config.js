/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary": '#f0852a',
        "secondary": '#161616',
        "Neutral": '#f9f9f9',
        "white": "#ffffff",
        "primary700": "#c2410c",
        "primary400": "#f0851f",
      },
    },

  },
  plugins: [],
}
