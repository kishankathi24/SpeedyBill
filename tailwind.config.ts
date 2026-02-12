import type { Config } from "tailwindcss";

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FAF9F6",
      },
      boxShadow: {
        paper: "0 12px 36px rgba(31, 41, 55, 0.12)",
      },
    },
  },
  plugins: [],
} satisfies Config;
