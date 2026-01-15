/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        wedding: {
          primary: '#D4AF37', // Gold
          secondary: '#f3f4f6', // Soft Gray
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'serif'], // Sophisticated serif for headings
      },
    },
  },
  plugins: [],
}
