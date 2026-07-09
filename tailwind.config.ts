import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          black: "#050505",
          dark: "#0a0a0a",
          gold: "#d4af37",
          accent: "#3b82f6"
        }
      },
      backgroundImage: {
        'mesh': "radial-gradient(at 0% 0%, rgba(59, 130, 246, 0.15) 0, transparent 50%), radial-gradient(at 100% 100%, rgba(99, 102, 241, 0.15) 0, transparent 50%)",
      }
    },
  },
  plugins: [],
};
export default config;
