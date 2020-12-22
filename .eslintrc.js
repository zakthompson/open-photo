module.exports = {
  parserOptions: {
    ecmaVersion: 2020,
  },
  plugins: ['prettier'],
  extends: [
    'airbnb',
    'airbnb/hooks',
    'plugin:prettier/recommended',
    'prettier/react',
  ],
  globals: {
    window: 'readonly',
    fetch: 'readonly',
  },
  rules: {
    'no-underscore-dangle': 0,
  },
};
