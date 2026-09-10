/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        digitBlue: "#00269A",
        digitCyan: "#00C1DE",
        digitPink: "#E50695",
        digitDark: "#222222",
        digitGray: "#0f1117"
      }
    },
  },
  plugins: [],
}