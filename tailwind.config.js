/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Geist', 'ui-sans-serif', 'system-ui'],
        'serif': ['Avro', 'ui-serif', 'Georgia'],
        'heading': ['Avro', 'ui-serif', 'Georgia'],
        'body': ['Geist', 'ui-sans-serif', 'system-ui'],
        'display': ['Avro', 'ui-serif', 'Georgia'],
      }
    },
  },
  plugins: [],
}