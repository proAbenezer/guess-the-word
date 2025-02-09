/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html"],
  theme: {
    screens: {
      xs: "375px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1440px",
    },
    extend: {
      colors: {
        deepViolet: "#7429C6",
        brightOrchid: "#C951E7",
        darkGrape: "#672171",
        steelGray: "#4A5567",
        dustyBlue: "#97A3B6",
        midnightBlack: "#1c1e27",
        softCloud: "#F2F5F9",
      },
    },
  },
  plugins: [],
};
