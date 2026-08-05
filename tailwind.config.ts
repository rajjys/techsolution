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
        /*
         * Surfaces de section — le rythme de fond de la page d'accueil.
         * `cool` et `cool-deep` portent toujours la paire de halos radiaux
         * (cf. <Glow />) ; `warm` est une ponctuation, une seule par page.
         */
        surface: {
          cool: "#F4F7FE",
          "cool-deep": "#E8EEFA",
          warm: "#FAF7F0",
        },
        /**
         * @deprecated Palette héritée. Les fonds sont passés sur `brand` et
         * le texte quasi-noir sur `slate-900`. Ne pas utiliser dans du
         * nouveau code — cf. docs/design-system.md.
         */
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
          50: "#F2F2FD",  // New: Very soft, almost-white tint for subtle backgrounds
          100: "#E5E5FB",
          200: "#C9C8F6",
          300: "#A6A5EF",
          400: "#6E6DE0",
          500: "#3130D0",
          600: "#2A28B8",
          700: "#232199",
          800: "#1C1A7A",
          900: "#15135A",  // New: Deep, legible navy for high-contrast text or dark-mode cards
          950: "#0B0A33",  // New: Near-black indigo, perfect for dark-mode backgrounds
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
        /*
         * Marque — orange brûlé des appels à l'action (#C2410C) et crème du
         * hero (#FFF7ED). Même famille : la rampe reprend exactement l'échelle
         * `orange` de Tailwind, dont ces deux teintes sont les crans 700 et 50.
         * Usage : ember-700 pour un CTA, ember-800 au survol, ember-50 en fond.
         */
        ember: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          300: "#FDBA74",
          400: "#FB923C",
          500: "#F97316",
          600: "#EA580C",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
          950: "#431407",
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
