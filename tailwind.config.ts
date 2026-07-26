import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-container": "rgb(var(--color-primary-container-rgb) / <alpha-value>)",
        "error": "#ffb4ab",
        "surface-container-highest": "rgb(var(--color-surface-container-highest-rgb) / <alpha-value>)",
        "surface-container-high": "rgb(var(--color-surface-container-high-rgb) / <alpha-value>)",
        "on-tertiary-container": "#f8f5ff",
        "surface-container-lowest": "rgb(var(--color-surface-container-lowest-rgb) / <alpha-value>)",
        "on-secondary-fixed-variant": "#004f54",
        "surface": "rgb(var(--color-surface-rgb) / <alpha-value>)",
        "secondary-fixed-dim": "#00dbe9",
        "on-tertiary": "#1000a9",
        "on-surface": "rgb(var(--color-on-surface-rgb) / <alpha-value>)",
        "surface-bright": "rgb(var(--color-surface-bright-rgb) / <alpha-value>)",
        "on-primary-container": "rgb(var(--color-on-primary-container-rgb) / <alpha-value>)",
        "secondary-fixed": "#7df4ff",
        "on-background": "rgb(var(--color-on-surface-rgb) / <alpha-value>)",
        "tertiary-fixed": "#e1e0ff",
        "surface-variant": "rgb(var(--color-surface-variant-rgb) / <alpha-value>)",
        "tertiary-container": "rgb(var(--color-light-violet-rgb) / <alpha-value>)",
        "on-tertiary-fixed-variant": "#2f2ebe",
        "error-container": "#93000a",
        "primary": "rgb(var(--color-primary-rgb) / <alpha-value>)",
        "on-primary": "rgb(var(--color-on-primary-rgb) / <alpha-value>)",
        "inverse-primary": "rgb(var(--color-inverse-primary-rgb) / <alpha-value>)",
        "on-error": "#690005",
        "surface-dim": "rgb(var(--color-background-rgb) / <alpha-value>)",
        "primary-fixed": "rgb(var(--color-light-violet-rgb) / <alpha-value>)",
        "on-tertiary-fixed": "#07006c",
        "surface-container": "rgb(var(--color-surface-container-rgb) / <alpha-value>)",
        "on-primary-fixed-variant": "rgb(var(--color-deep-violet-rgb) / <alpha-value>)",
        "secondary": "rgb(var(--color-light-violet-rgb) / <alpha-value>)",
        "on-secondary-fixed": "#002022",
        "secondary-container": "rgb(var(--color-light-violet-rgb) / <alpha-value>)",
        "background": "rgb(var(--color-background-rgb) / <alpha-value>)",
        "outline": "rgb(var(--color-outline-rgb) / <alpha-value>)",
        "on-surface-variant": "rgb(var(--color-on-surface-variant-rgb) / <alpha-value>)",
        "surface-tint": "rgb(var(--color-primary-rgb) / <alpha-value>)",
        "outline-variant": "rgb(var(--color-outline-variant-rgb) / <alpha-value>)",
        "primary-fixed-dim": "rgb(var(--color-primary-rgb) / <alpha-value>)",
        "inverse-surface": "rgb(var(--color-inverse-surface-rgb) / <alpha-value>)",
        "tertiary": "rgb(var(--color-light-violet-rgb) / <alpha-value>)",
        "on-error-container": "#ffdad6",
        "on-secondary-container": "#00686f",
        "surface-container-low": "rgb(var(--color-surface-container-low-rgb) / <alpha-value>)",
        "on-primary-fixed": "rgb(var(--color-deep-violet-rgb) / <alpha-value>)",
        "tertiary-fixed-dim": "#c0c1ff",
        "inverse-on-surface": "rgb(var(--color-inverse-on-surface-rgb) / <alpha-value>)",
        "on-secondary": "#00363a"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        "margin-x": "40px",
        "section-gap": "160px",
        "container-max": "1280px",
        "base": "8px",
        "gutter": "24px",
        "section-gap-sm": "60px",
        "section-gap-md": "100px",
        "section-gap-lg": "120px",
        "section-gap-hero": "40px",
        "breathing": "80px"
      },
      fontFamily: {
        "display-xl": ["Newsreader"],
        "body-md": ["Geist"],
        "body-lg": ["Geist"],
        "headline-md": ["Newsreader"],
        "headline-lg": ["Newsreader"],
        "label-sm": ["JetBrains Mono"]
      },
      fontSize: {
        "display-xl": ["128px", { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "600" }],
        "body-md": ["16px", {"lineHeight": "1.6", "letterSpacing": "0.01em", "fontWeight": "400"}],
        "body-lg": ["18px", {"lineHeight": "1.6", "letterSpacing": "0.01em", "fontWeight": "400"}],
        "headline-md": ["32px", {"lineHeight": "1.3", "letterSpacing": "0em", "fontWeight": "500"}],
        "headline-lg": ["48px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "500"}],
        "label-sm": ["12px", {"lineHeight": "1.0", "letterSpacing": "0.08em", "fontWeight": "500"}]
      },
      boxShadow: {
        "glow-primary": "0 0 30px rgb(var(--color-light-violet-rgb) / 0.24)",
        "glow-primary-lg": "0 0 40px rgb(var(--color-light-violet-rgb) / 0.34)",
        "glow-accent": "0 0 20px rgb(var(--color-deep-violet-rgb) / 0.2)"
      }
    },
  },
  plugins: [],
} satisfies Config
