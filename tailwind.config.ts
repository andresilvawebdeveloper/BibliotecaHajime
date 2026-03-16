import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'hajime-blue': '#0055A4',
        'hajime-black': '#1A1A1A',
      },
    },
  },
  plugins: [],
};
export default config;