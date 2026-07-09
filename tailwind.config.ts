import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}", "./src/app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: { premium: { black: "#020202", blue: "#3b82f6" } },
    },
  },
  plugins: [],
};
export default config;
