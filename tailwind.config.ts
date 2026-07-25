import type { Config } from "tailwindcss";
import defaultTheme from "tailwindcss/defaultTheme";
import tailwindcssAnimate from "tailwindcss-animate";

/**
 * TECH SOLUTION RDC — Design System
 * Palette officielle : navy (autorité ingénierie) + solar (énergie propre).
 * Thème clair uniquement.
 */
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.25rem",
        sm: "1.5rem",
        lg: "2rem",
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1240px",
        "2xl": "1280px",
      },
    },
    extend: {
      colors: {
        /* Marque — bleu marine corporate */
        navy: {
          50: "#F2F6FB",
          100: "#E3EBF5",
          200: "#C7D7EA",
          300: "#9DB9D8",
          400: "#6C95C1",
          500: "#4877A8",
          600: "#365F8D",
          700: "#2A4C74",
          800: "#1E3E62",
          900: "#152D48",
          950: "#0B192C",
        },
        /* Marque — bleu officiel du logo (#3130D0) */
        brand: {
          100: "#E5E5FB",
          200: "#C9C8F6",
          300: "#A6A5EF",
          400: "#6E6DE0",
          500: "#3130D0",
          600: "#2A28B8",
          700: "#232199",
          800: "#1C1A7A",
        },
        /* Marque — jaune solaire / ambre électrique */
        solar: {
          50: "#FFFBEB",
          100: "#FFF3C4",
          200: "#FFE68A",
          300: "#FFD34D",
          400: "#F1C40F",
          500: "#FFB800",
          600: "#D99C00",
          700: "#B37D00",
          800: "#8C5F00",
          900: "#664400",
        },
        /* Jetons sémantiques (composants UI style shadcn) */
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        sans: ["var(--font-outfit)", ...defaultTheme.fontFamily.sans],
        display: ["var(--font-outfit)", ...defaultTheme.fontFamily.sans],
      },
      boxShadow: {
        card: "0 2px 12px -2px rgba(11, 25, 44, 0.08)",
        soft: "0 24px 48px -24px rgba(11, 25, 44, 0.18)",
        lift: "0 32px 64px -28px rgba(11, 25, 44, 0.28)",
        glow: "0 0 64px -12px rgba(255, 184, 0, 0.45)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "pulse-dot": {
          "0%": { transform: "scale(1)", opacity: "0.55" },
          "100%": { transform: "scale(2.8)", opacity: "0" },
        },
        shimmer: {
          from: { backgroundPosition: "200% 0" },
          to: { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.25s ease-out",
        "accordion-up": "accordion-up 0.25s ease-out",
        marquee: "marquee 45s linear infinite",
        float: "float 5.5s ease-in-out infinite",
        "float-delayed": "float 6.5s ease-in-out 1.2s infinite",
        "pulse-dot": "pulse-dot 2.4s ease-out infinite",
      },
    },
  },
  plugins: [tailwindcssAnimate],
};

export default config;
