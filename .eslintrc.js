module.exports = {
  plugins: ['eslint-plugin-tsdoc'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: './tsconfig-test.json',
  },
  extends: [
    'plugin:@typescript-eslint/recommended', // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier/@typescript-eslint', // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended', // Enables eslint-plugin-prettier and eslint-config-prettier. This will display prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
  ],
  rules: {
    '@typescript-eslint/no-var-requires': 0,
    'tsdoc/syntax': 'warn',
  },
};
