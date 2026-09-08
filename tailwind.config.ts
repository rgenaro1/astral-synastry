import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0C0A10", // Terciopelo obsidiana cálido
        surface: {
          50: "#16121F",
          100: "#1E182A",
          200: "#272036",
          300: "#342B46",
          400: "#44395A",
        },
        astral: {
          champagne: "#F3E7C4",
          champagneDark: "#CBB37C",
          gold: "#D8B26E",
          roseGold: "#E8B4B8",
          blush: "#F9E4E8",
          mauve: "#C49BB5",
          lavender: "#D6BFE8",
          plum: "#4A3353",
          coral: "#F28C8C",
          teal: "#73BBA3",
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "feminine-glow": "radial-gradient(circle at 50% 0%, rgba(232, 180, 184, 0.12) 0%, rgba(12, 10, 16, 0) 70%)",
        "velvet-card": "linear-gradient(180deg, rgba(30, 24, 42, 0.75) 0%, rgba(22, 18, 31, 0.75) 100%)",
      },
      animation: {
        "pulse-slow": "pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "spin-slow": "spin 50s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
