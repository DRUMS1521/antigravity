/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0faf4',
          100: '#dcf5e6',
          200: '#bbe9ce',
          300: '#86d5ab',
          400: '#4ab980',
          500: '#27a060',
          600: '#1a6b3a',  // color institucional principal
          700: '#165830',
          800: '#134527',
          900: '#0f3820',
        },
      },
    },
  },
  plugins: [],
}
