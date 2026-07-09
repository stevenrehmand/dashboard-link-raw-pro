import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}", // Ini akan men-scan semua file di src
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        premium: {
          black: "#050505",
          blue: "#3b82f6",
        }
      },
    },
  },
  plugins: [],
};
export default config;
