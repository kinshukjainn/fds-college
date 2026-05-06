// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      keyframes: {
        smoothSpin: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      animation: {
        smoothSpin: "smoothSpin 1.2s ease-in-out infinite",
      },
      fontFamily: {
        // Add your custom font here
        worksans: ["var(--font-work-sans)", "sans-serif"],
        inter: ["var(--font-inter)", "sans-serif"],
        dmmono: ["var(--font-dm-mono)", "monospace"],
        lucide: ["var(--font-lucide)", "sans-serif"],
        segoeUI: ["var(--font-segoe-ui)", "sans-serif"],
        rubik: ["var(--font-rubik)", "sans-serif"],
        ptSans: ["var(--font-pt-sans)", "sans-serif"],
        arimo: ["var(--font-arimo)", "sans-serif"],
        raleway: ["var(--font-raleway)", "sans-serif"],
        publicsans: ["var(--font-public-sans)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
        robotoSerif: ["var(--font-roboto-slab)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
