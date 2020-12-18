module.exports = {
  plugins: ['prettier'],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:prettier/recommended',
    'prettier/react',
  ],
  globals: {
    fetch: 'readonly',
  },
  rules: {
    'no-underscore-dangle': 0,
  },
};
