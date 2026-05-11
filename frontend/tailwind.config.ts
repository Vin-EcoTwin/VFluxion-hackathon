import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/app/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/domains/**/*.{ts,tsx}",
    "./src/map/**/*.{ts,tsx}",
    "./src/simulation/**/*.{ts,tsx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "on-secondary-container": "var(--on-secondary-container)",
        "tertiary": "var(--tertiary)",
        "on-primary": "var(--on-primary)",
        "tertiary-container": "var(--tertiary-container)",
        "error-container": "var(--error-container)",
        "primary-fixed": "var(--primary-fixed)",
        "on-surface-variant": "var(--on-surface-variant)",
        "surface": "var(--surface)",
        "inverse-on-surface": "var(--inverse-on-surface)",
        "on-error-container": "var(--on-error-container)",
        "on-secondary-fixed": "var(--on-secondary-fixed)",
        "on-secondary-fixed-variant": "var(--on-secondary-fixed-variant)",
        "surface-dim": "var(--surface-dim)",
        "primary-container": "var(--primary-container)",
        "primary-fixed-dim": "var(--primary-fixed-dim)",
        "surface-container-high": "var(--surface-container-high)",
        "secondary-fixed": "var(--secondary-fixed)",
        "on-error": "var(--on-error)",
        "tertiary-fixed": "var(--tertiary-fixed)",
        "on-primary-fixed": "var(--on-primary-fixed)",
        "secondary": "var(--secondary)",
        "surface-variant": "var(--surface-variant)",
        "on-primary-container": "var(--on-primary-container)",
        "inverse-surface": "var(--inverse-surface)",
        "tertiary-fixed-dim": "var(--tertiary-fixed-dim)",
        "outline": "var(--outline)",
        "secondary-container": "var(--secondary-container)",
        "on-secondary": "var(--on-secondary)",
        "outline-variant": "var(--outline-variant)",
        "on-tertiary": "var(--on-tertiary)",
        "on-tertiary-fixed-variant": "var(--on-tertiary-fixed-variant)",
        "surface-container": "var(--surface-container)",
        "surface-tint": "var(--surface-tint)",
        "background": "var(--background)",
        "on-background": "var(--on-background)",
        "surface-container-low": "var(--surface-container-low)",
        "on-tertiary-container": "var(--on-tertiary-container)",
        "on-primary-fixed-variant": "var(--on-primary-fixed-variant)",
        "on-tertiary-fixed": "var(--on-tertiary-fixed)",
        "inverse-primary": "var(--inverse-primary)",
        "error": "var(--error)",
        "surface-container-lowest": "var(--surface-container-lowest)",
        "on-surface": "var(--on-surface)",
        "secondary-fixed-dim": "var(--secondary-fixed-dim)",
        "surface-container-highest": "var(--surface-container-highest)",
        "surface-bright": "var(--surface-bright)",
        "primary": "var(--primary)"
      },
      fontFamily: {
        "label-md": ["Inter", "Space Grotesk", "sans-serif"],
        "body-sm": ["Inter", "sans-serif"],
        "headline-md": ["Space Grotesk", "sans-serif"],
        "body-lg": ["Inter", "sans-serif"],
        "headline-lg": ["Space Grotesk", "Manrope", "sans-serif"],
        "label-sm": ["Space Grotesk", "Inter", "sans-serif"],
        "headline-xl": ["Space Grotesk", "Manrope", "sans-serif"],
        "data-mono": ["Space Grotesk", "sans-serif"],
        "body-md": ["Inter", "sans-serif"],
        "h1": ["Manrope", "sans-serif"],
        "h2": ["Manrope", "sans-serif"],
        "h3": ["Manrope", "sans-serif"],
        "label-caps": ["Inter", "sans-serif"],
        "stat-display": ["Manrope", "sans-serif"]
      },
      fontSize: {
        "label-md": ["14px", { "lineHeight": "16px", "letterSpacing": "0.05em", "fontWeight": "500" }],
        "body-sm": ["14px", { "lineHeight": "20px", "fontWeight": "400" }],
        "headline-md": ["24px", { "lineHeight": "32px", "fontWeight": "600" }],
        "body-lg": ["18px", { "lineHeight": "28px", "fontWeight": "400" }],
        "headline-lg": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "label-sm": ["12px", { "lineHeight": "14px", "letterSpacing": "0.08em", "fontWeight": "500" }],
        "headline-xl": ["48px", { "lineHeight": "56px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "data-mono": ["16px", { "lineHeight": "24px", "fontWeight": "600" }],
        "body-md": ["16px", { "lineHeight": "24px", "fontWeight": "400" }],
        "h3": ["24px", { "lineHeight": "32px", "letterSpacing": "0em", "fontWeight": "600" }],
        "h1": ["40px", { "lineHeight": "48px", "letterSpacing": "-0.02em", "fontWeight": "700" }],
        "h2": ["32px", { "lineHeight": "40px", "letterSpacing": "-0.01em", "fontWeight": "600" }],
        "label-caps": ["12px", { "lineHeight": "16px", "letterSpacing": "0.1em", "fontWeight": "700" }],
        "stat-display": ["64px", { "lineHeight": "72px", "letterSpacing": "-0.04em", "fontWeight": "700" }]
      },
      spacing: {
        "sm": "8px",
        "container-margin": "32px",
        "container-padding": "32px",
        "lg": "24px",
        "unit": "4px",
        "widget-gap": "20px",
        "md": "16px",
        "xs": "4px",
        "xl": "40px",
        "gutter": "24px"
      },
      borderRadius: {
        "DEFAULT": "0.125rem",
        "lg": "0.25rem",
        "xl": "0.5rem",
        "full": "9999px"
      }
    }
  },
  plugins: [
    require("@tailwindcss/container-queries")
  ]
};

export default config;
