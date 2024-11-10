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
        "Neutral": '#e5e5e5',
      },
    },

  },
  plugins: [],
}
