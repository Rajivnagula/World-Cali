/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0d0d1a',
          orange: '#FF8C00',
          gold: '#FFD700',
          card: '#1a1a2e',
        },
      },
    },
  },
  plugins: [],
};
