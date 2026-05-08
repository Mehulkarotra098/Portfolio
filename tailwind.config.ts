import type { Config } from 'tailwindcss'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-container": "#2e62ff",
        "error": "#ffb4ab",
        "surface-container-highest": "#353534",
        "surface-container-high": "#2a2a2a",
        "on-tertiary-container": "#f8f5ff",
        "surface-container-lowest": "#0e0e0e",
        "on-secondary-fixed-variant": "#004f54",
        "surface": "#131313",
        "secondary-fixed-dim": "#00dbe9",
        "on-tertiary": "#1000a9",
        "on-surface": "#e5e2e1",
        "surface-bright": "#3a3939",
        "on-primary-container": "#f7f6ff",
        "secondary-fixed": "#7df4ff",
        "on-background": "#e5e2e1",
        "tertiary-fixed": "#e1e0ff",
        "surface-variant": "#353534",
        "tertiary-container": "#5c5fea",
        "on-tertiary-fixed-variant": "#2f2ebe",
        "error-container": "#93000a",
        "primary": "#b7c4ff",
        "on-primary": "#002682",
        "inverse-primary": "#024cec",
        "on-error": "#690005",
        "surface-dim": "#131313",
        "primary-fixed": "#dce1ff",
        "on-tertiary-fixed": "#07006c",
        "surface-container": "#201f1f",
        "on-primary-fixed-variant": "#0039b5",
        "secondary": "#d3fbff",
        "on-secondary-fixed": "#002022",
        "secondary-container": "#00eefc",
        "background": "#131313",
        "outline": "#8d90a2",
        "on-surface-variant": "#c3c5d8",
        "surface-tint": "#b7c4ff",
        "outline-variant": "#434656",
        "primary-fixed-dim": "#b7c4ff",
        "inverse-surface": "#e5e2e1",
        "tertiary": "#c0c1ff",
        "on-error-container": "#ffdad6",
        "on-secondary-container": "#00686f",
        "surface-container-low": "#1c1b1b",
        "on-primary-fixed": "#001552",
        "tertiary-fixed-dim": "#c0c1ff",
        "inverse-on-surface": "#313030",
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
        "gutter": "24px"
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
        "display-xl": ["80px", {"lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "600"}],
        "body-md": ["16px", {"lineHeight": "1.6", "letterSpacing": "0.01em", "fontWeight": "400"}],
        "body-lg": ["18px", {"lineHeight": "1.6", "letterSpacing": "0.01em", "fontWeight": "400"}],
        "headline-md": ["32px", {"lineHeight": "1.3", "letterSpacing": "0em", "fontWeight": "500"}],
        "headline-lg": ["48px", {"lineHeight": "1.2", "letterSpacing": "-0.01em", "fontWeight": "500"}],
        "label-sm": ["12px", {"lineHeight": "1.0", "letterSpacing": "0.08em", "fontWeight": "500"}]
      }
    },
  },
  plugins: [],
} satisfies Config
