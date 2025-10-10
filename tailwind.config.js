/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: { 
        primary:"rgb(2, 0, 14)",
    },
    fontFamily: {
      space: ["Space Grotesk", 'sans-serif'],
    },
  },
  plugins: [],
}
}