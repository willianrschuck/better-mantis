/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/**/*.html"
  ],
  theme: {
    fontFamily: {
      mono: [ "JetBrains Mono", "monospaced" ]
    },
    extend: {},
  },
  plugins: [],
}