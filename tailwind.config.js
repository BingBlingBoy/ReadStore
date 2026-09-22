/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    // Ensure this points to your source code
    '"./src/**/*.{js,jsx,ts,tsx}"'
    // If you use a `src` directory, add: './src/**/*.{js,tsx,ts,jsx}'
    // Do the same with `components`, `hooks`, `styles`, or any other top-level directories
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        title: "#f1f5f9",
        primaryText: "#f1f5f9",
        secondaryText: "#cbd5e1",
        tertiaryText: "#94a3b8",
        primary: "#6366f1",
        background: "#0f172a",
        surface: "#1e293b",
      }
    },
  },
  plugins: [],
};

