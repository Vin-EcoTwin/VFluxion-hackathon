import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/domains/**/*.{ts,tsx}",
    "./src/map/**/*.{ts,tsx}",
    "./src/simulation/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          bg: "#05070d",
          panel: "#0d1324",
          neon: "#00f0ff",
          pink: "#ff2bd6",
          lime: "#b5ff3d",
          warning: "#ff9f1c"
        }
      },
      boxShadow: {
        neon: "0 0 16px rgba(0, 240, 255, 0.4), 0 0 36px rgba(255, 43, 214, 0.22)",
        panel: "0 0 1px rgba(0, 240, 255, 0.5), inset 0 0 32px rgba(2, 9, 22, 0.85)"
      },
      backgroundImage: {
        "grid-fade":
          "linear-gradient(rgba(0,240,255,0.07) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,0.07) 1px, transparent 1px)"
      }
    }
  },
  plugins: []
};

export default config;
