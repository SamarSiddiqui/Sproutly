
export default {
  content: [
    './src/**/*.{js,ts,jsx,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        sproutly: {
          // Main Dashboard colors
          primary: '#1B4332',
          secondary: '#52796F',
          light: '#74C69D',
          bg: '#FEFAE0',
          warning: '#E9C46A',
          urgent: '#E76F51',
          card: '#FFFFFF',
          // PreLogin Landing page colors
          cream: '#FAF7F2',
          forest: '#2F4F37',
          sage: '#6B8E5A',
          terracotta: '#C8654A',
          beige: '#EFEBE0',
          sand: '#E5DFD3'
        }
      },
      fontFamily: {
        sans: ['"DM Sans"', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
        serif: ['Fraunces', 'serif'],
      }
    },
  },
  plugins: [],
}
