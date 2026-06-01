/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["ui-monospace", "SFMono-Regular", "monospace"],
      },
      colors: {
        ink: {
          950: "#05060c",
          900: "#080a14",
          850: "#0b0e1c",
          800: "#0f1324",
          700: "#161b30",
          600: "#1e2440",
          500: "#2a3056",
        },
        glow: {
          cyan: "#22d3ee",
          violet: "#a855f7",
          magenta: "#ec4899",
          emerald: "#34d399",
          amber: "#fbbf24",
          rose: "#fb7185",
          blue: "#60a5fa",
        },
      },
      boxShadow: {
        glow: "0 0 24px -4px var(--tw-shadow-color)",
        "glow-lg": "0 0 60px -8px var(--tw-shadow-color)",
      },
      keyframes: {
        "pulse-ring": {
          "0%": { transform: "scale(0.9)", opacity: "0.7" },
          "70%": { transform: "scale(1.6)", opacity: "0" },
          "100%": { transform: "scale(1.6)", opacity: "0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
        "grid-drift": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "40px 40px" },
        },
      },
      animation: {
        "pulse-ring": "pulse-ring 2s cubic-bezier(0.4,0,0.6,1) infinite",
        float: "float 6s ease-in-out infinite",
        shimmer: "shimmer 2s infinite",
        "grid-drift": "grid-drift 20s linear infinite",
      },
    },
  },
  plugins: [],
};
