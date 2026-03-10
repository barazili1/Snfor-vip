/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./App.tsx",
    "./index.tsx",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        ar: ['Jzoor', 'Cairo', 'sans-serif'],
        en: ['Ethnocentric', 'sans-serif'],
      },
      colors: {
        lime: {
          400: '#a3e635',
        }
      }
    },
  },
  plugins: [],
}
