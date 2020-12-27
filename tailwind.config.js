// Useful for extending values in the future:
// const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true,
  },
  purge: {
    content: ['./components/**/*.jsx', './pages/**/*.jsx'],
  },
  theme: {
    fontFamily: {
      body: ['Overpass', 'sans-serif'],
    },
    extend: {
      colors: {
        gray: {
          light: '#8B8B8B',
          dark: '#343432',
        },
        green: {
          medium: '#9FD188',
        },
      },
      transitionProperty: {
        'text-size': 'font-size',
      },
    },
  },
  variants: {
    extend: {
      fontWeight: ['hover'],
    },
  },
  plugins: [],
};
