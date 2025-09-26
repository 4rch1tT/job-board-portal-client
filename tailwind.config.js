/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', 
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Geist', 'ui-sans-serif', 'system-ui'],
        'serif': ['Arvo', 'ui-serif', 'Georgia'],
        'heading': ['Arvo', 'ui-serif', 'Georgia'],
        'body': ['Geist', 'ui-sans-serif', 'system-ui'],
        'display': ['Arvo', 'ui-serif', 'Georgia'],
      }
    },
  },
  plugins: [],
}