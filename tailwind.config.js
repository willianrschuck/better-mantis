/** @type {import('tailwindcss').Config} */
const { ...colors} = require("tailwindcss/colors");

module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    fontFamily: {
      mono: [ "JetBrains Mono", "monospaced" ]
    },
    colors: {
      primary: {
        DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
        fg: 'hsl(var(--primary-fg) / <alpha-value>)'
      },
      secondary: {
        DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
        fg: 'hsl(var(--secondary-fg) / <alpha-value>)'
      },
      ...colors
    }
  },
  plugins: [],
}