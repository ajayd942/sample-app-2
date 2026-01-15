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
        sans: ['Lato', 'sans-serif'],
        serif: ['Playfair Display', 'serif'],
        script: ['Great Vibes', 'cursive'], // Custom class for signatures
      },
    },
  },
  plugins: [],
}
