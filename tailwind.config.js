
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: 'var(--primary-color)',
        secondary: '#161616',
        Neutral: '#f9f9f9',
        white: "#ffffff",
        primary700: "#c2410c",
        primary400: "#f0851f",
        black: "#000000",
      },
      keyframes: {
        "slide-in-right": {
          "0%": {
            visibility: "visible",
            transform: "translate3d(100%, 0, 0)",
          },
          "100%": {
            transform: "translate3d(0, 0, 0)",
          },
        },
      },
    },
  },
  plugins: [],
}
