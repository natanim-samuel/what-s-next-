/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        bg: "#141216",
        raised: "#1C191F",
        card: "#211D24",
        hairline: "#332E38",
        gold: "#C9A24B",
        goldDim: "#8C7433",
        cream: "#EDE6D6",
        creamDim: "#A69C8C",
        danger: "#B4544A",
        success: "#6E9C63",
      },
      fontFamily: {
        display: ["'Cormorant SC'", "'Cormorant Garamond'", "serif"],
        serif: ["'Cormorant Garamond'", "serif"],
        sans: ["'Inter'", "sans-serif"],
      },
    },
  },
  plugins: [],
};