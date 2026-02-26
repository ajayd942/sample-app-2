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
          primary: '#D4AF37',    // Champagne gold
          secondary: '#1a0a0f',  // Deep plum (dark bg)
          rose: '#c9847a',       // Dusty rose accent
          blush: '#f2d7d0',      // Soft blush text
          parchment: '#f5efe8',  // Warm parchment
          dark: '#0d0508',       // Deepest bg
          card: '#2a1018',       // Card surface
          border: '#3d1a24',     // Subtle border
        },
      },
      fontFamily: {
        sans: ['Jost', 'sans-serif'],
        serif: ['Cormorant Garamond', 'serif'],
        script: ['Great Vibes', 'cursive'],
      },
      keyframes: {
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-down': {
          '0%': { opacity: '0', transform: 'translateY(-20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'fade-in-right': {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'fade-in-left': {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'petal-drift': {
          '0%': { transform: 'translateY(-10px) rotate(0deg)', opacity: '0' },
          '10%': { opacity: '1' },
          '90%': { opacity: '0.3' },
          '100%': { transform: 'translateY(110vh) rotate(360deg)', opacity: '0' },
        },
      },
      animation: {
        'fade-in-up': 'fade-in-up 0.9s ease forwards',
        'fade-in-down': 'fade-in-down 0.7s ease forwards',
        'fade-in': 'fade-in 1s ease forwards',
        'fade-in-right': 'fade-in-right 0.8s ease forwards',
        'fade-in-left': 'fade-in-left 0.8s ease forwards',
        'shimmer': 'shimmer 2.5s linear infinite',
        'float': 'float 4s ease-in-out infinite',
        'petal-drift': 'petal-drift linear infinite',
      },
    },
  },
  plugins: [],
}
