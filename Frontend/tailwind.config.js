/** @type {import('tailwindcss').Config} */
// Note: With Tailwind CSS v4, most configuration is done in CSS files
// This file is kept for compatibility and can be removed if not needed
import daisyui from "daisyui";

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  plugins: [daisyui],
  daisyui: {
    themes: [
      {
        neon: {
          "primary": "#00eaff",      // neon blue
          "secondary": "#ff3cac",    // neon pink
          "accent": "#fff",          // white accent
          "neutral": "#232946",      // deep dark blue
          "base-100": "#121629",    // dark background
          "info": "#00eaff",
          "success": "#43ff64",
          "warning": "#ffe156",
          "error": "#ff3cac"
        },
      },
      "dark",
    ],
    darkTheme: "neon",
  },
}