const { lightPalette, darkPalette } = require("./src/lib/theme/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#f4f7fb",
          dark: "#070d15"
        },
        foreground: {
          DEFAULT: "#0f172a",
          dark: "#f8fbff"
        },
        card: {
          DEFAULT: "#ffffff",
          dark: "#0d1624"
        },
        primary: {
          DEFAULT: "#2D5BFF",
          dark: "#6B8AFF",
          foreground: "#ffffff",
          "foreground-dark": "#0B1220"
        },
        muted: {
          DEFAULT: "#f1f5f9",
          dark: "#121d2d",
          foreground: "#64748b",
          "foreground-dark": "#adc0d3"
        },
        border: {
          DEFAULT: "#e8eef6",
          dark: "#101d3f"
        },
        input: {
          DEFAULT: "#e5e7eb",
          dark: "#13214a"
        }
      }
    },
  },
  plugins: [],
};
