import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-syne)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        accent: {
          DEFAULT: "hsl(var(--color-accent))",
          foreground: "hsl(var(--color-accent-foreground))",
          warm: {
            DEFAULT: "hsl(var(--color-accent-warm))",
            foreground: "hsl(var(--color-accent-warm-foreground))",
          },
        },
        electric: {
          DEFAULT: "hsl(var(--color-electric))",
          foreground: "hsl(var(--color-electric-foreground))",
        },
        surface: {
          DEFAULT: "hsl(var(--color-surface))",
          muted: "hsl(var(--color-surface-muted))",
        },
      },
    },
  },
  plugins: [],
};

export default config;
