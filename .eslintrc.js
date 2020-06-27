module.exports = {
  env: {
    browser: true,
    es6: true,
  },
  extends: ['plugin:react/recommended', 'airbnb'],
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
  plugins: ['react'],
  parser: "babel-eslint",
  rules: {
    'react/jsx-props-no-spreading': ['off'],
    'react/jsx-filename-extension': ['off'],
    'no-use-before-define': ['off'],
    'operator-linebreak': ['off']
  },
};
