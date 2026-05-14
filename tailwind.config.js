/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b0a08',
        parchment: '#e8dcc0',
        amber: {
          DEFAULT: '#c89b3c',
          dim: '#8a6b28',
          bright: '#f0c060',
        },
        blood: '#7a1f1f',
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        amber: '0 0 30px rgba(200, 155, 60, 0.25)',
      },
    },
  },
  plugins: [],
}
