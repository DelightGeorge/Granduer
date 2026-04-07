/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "rgb(2, 0, 14)",
      },
      fontFamily: {
        space: ["Space Grotesk", "sans-serif"],
      },
      extend: {
        animation: { marquee: "marquee 22s linear infinite" },
        keyframes: {
          marquee: {
            "0%": { transform: "translateX(0)" },
            "100%": { transform: "translateX(-50%)" },
          },
        },
      },
    },
    plugins: [],
  },
};
