import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-atkinson)", "Arial", "sans-serif"],
        serif: ["var(--font-lora)", "Georgia", "serif"],
      },
      colors: {
        usana: {
          navy:  "#062460",
          royal: "#00529b",
          sky:   "#007dc3",
          light: "#79bde9",
          silver:"#aeb9bf",
        },
      },
    },
  },
  plugins: [],
};

export default config;
