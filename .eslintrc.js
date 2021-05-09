module.exports = {
  env: {
    browser: true,
    es6: true,
    jest: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:import/typescript',
    'plugin:react/recommended',
    'airbnb',
  ],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'react'],
  parser: 'babel-eslint',
  rules: {
    'react/jsx-props-no-spreading': ['off'],
    'react/jsx-filename-extension': ['off'],
    'react/static-property-placement': ['off'],
    'react/state-in-constructor': 'off',
    'no-use-before-define': ['off'],
    'operator-linebreak': ['off'],
    'object-curly-newline': ['off'],
    'import/prefer-default-export': ['off'],
    'import/extensions': 'off',
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {},
    },
  },
  ignorePatterns: ['**/lib/**'],
};
