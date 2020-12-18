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
  variants: {},
  plugins: [],
};
