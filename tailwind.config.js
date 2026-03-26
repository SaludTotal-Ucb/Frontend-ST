/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f4fbf8',
          100: '#d9f4e7',
          200: '#b1e9d1',
          300: '#7fd9b5',
          400: '#4ec596',
          500: '#2eab7b',
          600: '#228a63',
          700: '#1f6d51',
          800: '#1c5641',
          900: '#184735',
        },
      },
    },
  },
  plugins: [],
};
