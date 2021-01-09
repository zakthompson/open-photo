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
    document: 'readonly',
    fetch: 'readonly',
  },
};
