/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          navy: "#0F172A",
          dark: "#0E1629",
          deeper: "#0a0f1e",
        },
        accent: {
          pink: "#FF2E63",
          "pink-hover": "#db1143",
          orange: "#FF4800",
          cyan: "#08D9D6",
          purple: "#7367F0",
          green: "#009650",
          blue: "#2765EC",
          "blue-hover": "#1b56d5",
        },
        surface: {
          card: "#162036",
          "card-hover": "#1c2a46",
          border: "#444444",
          "border-light": "#57575b",
          overlay: "#000000",
          hover: "#1f1f1f",
        },
        text: {
          primary: "#F6F6F6",
          secondary: "#97A1AF",
          muted: "#d8e2f2",
          "muted-70": "rgba(216, 226, 242, 0.76)",
          placeholder: "rgba(234, 234, 234, 0.73)",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Outfit", "sans-serif"],
        canopee: ["canopee", "sans-serif"],
        editorial: ["editorial", "sans-serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-down": "slideDown 0.4s ease forwards",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideDown: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};
