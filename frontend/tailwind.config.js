/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        /* ── Allbirds exact palette ── */
        ab: {
          charcoal: "#212a2c",
          "charcoal-hover": "#1a2022",
          offwhite: "#f7f5f0",
          "light-gray": "#f0f0ed",
          "mid-gray": "#e0ded9",
          border: "#e5e4e0",
          "text-gray": "#6b7280",
        },
        brand: {
          navy: "#111827",
          dark: "#1a2332",
          deeper: "#0d1520",
          light: "#1f2d3d",
          lighter: "#2d3748",
          cream: "#f7f5f0",
          pearl: "#fafaf8",
          mist: "#f0f0ed",
          stone: "#e0ded9",
        },
        accent: {
          primary: "#212a2c",
          "primary-hover": "#1a2022",
          secondary: "#4a7c7d",
          warm: "#7fb3b4",
          sage: "#65a30d",
          success: "#16a34a",
          warning: "#d97706",
          error: "#dc2626",
          // Legacy aliases
          pink: "#212a2c",
          "pink-hover": "#1a2022",
          orange: "#fb923c",
          cyan: "#22d3ee",
          purple: "#818cf8",
          green: "#16a34a",
          blue: "#4a7c7d",
          "blue-hover": "#3a6a6b",
          gold: "#eab308",
          silver: "#9ca3af",
          bronze: "#b45309",
          indigo: "#212a2c",
        },
        surface: {
          card: "#1f2d3d",
          "card-hover": "#2d3748",
          border: "#2d3748",
          "border-light": "#374151",
          overlay: "#000000",
          hover: "#1f2d3d",
          background: "#111827",
          input: "#1f2d3d",
          "input-border": "#374151",
        },
        text: {
          primary: "#f9fafb",
          secondary: "#d1d5db",
          muted: "#9ca3af",
          "muted-70": "rgba(156,163,175,0.7)",
          placeholder: "rgba(107,114,128,0.8)",
          heading: "#f9fafb",
          body: "#e5e7eb",
          subtle: "#9ca3af",
          link: "#22d3ee",
          error: "#f87171",
          success: "#4ade80",
          warning: "#fcd34d",
        },
        light: {
          bg: "#ffffff",
          "bg-secondary": "#f7f5f0",
          surface: "#ffffff",
          "surface-2": "#f0f0ed",
          border: "#e5e4e0",
          "border-strong": "#d1d0cb",
          text: "#212a2c",
          "text-secondary": "#6b7280",
          "text-muted": "#9ca3af",
        },
      },

      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        display: ["Inter", "system-ui", "sans-serif"],
        serif: ["Source Serif 4", "DM Serif Display", "Georgia", "serif"],
        "dm-serif": ["DM Serif Display", "Georgia", "serif"],
        canopee: ["canopee", "sans-serif"],
        editorial: ["editorial", "sans-serif"],
      },

      fontSize: {
        "hero-sm": ["clamp(2.5rem, 6vw, 4.5rem)", { lineHeight: "1.05" }],
        "hero-lg": ["clamp(3.5rem, 8vw, 6.5rem)", { lineHeight: "1.02" }],
        "section": ["clamp(1.8rem, 4vw, 3rem)", { lineHeight: "1.1" }],
      },

      animation: {
        "fade-in": "fadeIn 0.6s ease-out",
        "slide-up": "slideUp 0.7s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        ticker: "ticker 28s linear infinite",
        shimmer: "shimmer 2s infinite",
        float: "float 6s ease-in-out infinite",
      },

      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(28px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(200%)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        ticker: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
      },

      boxShadow: {
        sm: "0 1px 2px rgba(0,0,0,0.04)",
        "card": "0 1px 4px rgba(0,0,0,0.05)",
        "card-hover": "0 8px 32px rgba(0,0,0,0.1)",
        "nav": "0 1px 0 rgba(0,0,0,0.06)",
        "soft": "0 2px 12px rgba(0,0,0,0.06)",
        "product": "0 2px 8px rgba(0,0,0,0.06)",
        "product-hover": "0 8px 24px rgba(0,0,0,0.1)",
      },

      borderRadius: {
        "4xl": "2rem",
        pill: "999px",
      },

      spacing: {
        "18": "4.5rem",
        "88": "22rem",
        "128": "32rem",
      },

      backgroundImage: {
        "gradient-warm": "linear-gradient(135deg, #ffffff 0%, #f7f5f0 100%)",
        "gradient-charcoal": "linear-gradient(135deg, #212a2c 0%, #2d3f42 100%)",
      },
    },
  },
  plugins: [],
};
