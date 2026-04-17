
export default {
  content: [
  './index.html',
  './src/**/*.{js,ts,jsx,tsx}'
],
  theme: {
    extend: {
      colors: {
        verdant: {
          primary: '#1B4332',
          secondary: '#52796F',
          light: '#74C69D',
          bg: '#FEFAE0',
          warning: '#E9C46A',
          urgent: '#E76F51',
          card: '#FFFFFF',
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
