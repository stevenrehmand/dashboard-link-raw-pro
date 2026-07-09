import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}", // Hanya fokus ke src/app sesuai struktur Anda
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: "#0a0f1c",
          800: "#0f172a",
        },
      },
      backgroundImage: {
        'premium-gradient': 'linear-gradient(to right, #38bdf8, #3b82f6, #6366f1)',
      },
    },
  },
  plugins: [],
};
export default config;
