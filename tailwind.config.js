/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#f0852a', 
        secondary: '#161616', 
      },
    },
    colors: {
      "orange": "#f0852a",
      "gray": "#d1d5db",
      "white": "#FFFFFF",
      "black": "#000000",
    },

  },
  plugins: [],
}
