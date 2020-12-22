module.exports = {
  plugins: ['stylelint-prettier'],
  extends: [
    '@wemake-services/stylelint-config-scss',
    'stylelint-prettier/recommended',
  ],
  rules: {
    'scss/at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: ['layer', 'screen'],
      },
    ],
  },
};
