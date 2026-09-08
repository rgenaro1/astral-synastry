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
        background: "#040814", // Noche azul zafiro cósmica
        surface: {
          50: "#0B1528",  // Midnight blue zafiro
          100: "#101D38", // Azul marino cósmico
          200: "#16284D", // Índigo azul profundo
          300: "#1E3566", // Azul estelar intermedio
          400: "#2B4985", // Azul celeste suave
        },
        astral: {
          cyan: "#38BDF8", // Cyan glacial estelar
          azure: "#60A5FA", // Azul zafiro luminoso
          ice: "#E0F2FE", // Blanco glacial
          silver: "#E2E8F0", // Plata estelar
          sapphire: "#2563EB", // Zafiro real profundo
          champagne: "#BAE6FD", // Azul diamante estelar
          champagneDark: "#60A5FA",
          gold: "#38BDF8", // Cyan estelar brillante
          roseGold: "#38BDF8", // Cyan celestial radiante (mapea todos los acentos editoriales a azul)
          blush: "#E0F2FE", // Brillo blanco glacial
          mauve: "#818CF8", // Índigo etéreo
          lavender: "#A5B4FC", // Lavanda azulada
          plum: "#1E293B", // Azul pizarra profundo
          coral: "#F87171", // Coral cósmico para aspectos desafiantes
          teal: "#2DD4BF", // Turquesa celestial
        },
      },
      fontFamily: {
        serif: ["Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["Inter", "Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "feminine-glow": "radial-gradient(circle at 50% 0%, rgba(56, 189, 248, 0.15) 0%, rgba(4, 8, 20, 0) 70%)",
        "velvet-card": "linear-gradient(180deg, rgba(16, 29, 56, 0.75) 0%, rgba(11, 21, 40, 0.75) 100%)",
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
