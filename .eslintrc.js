module.exports = {
  'env': {
    'es6': true,
    'node': true,
    'mocha': true,
  },
  'extends': [
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'google',
  ],
  'globals': {
    'Atomics': 'readonly',
    'SharedArrayBuffer': 'readonly',
  },
  'parser': '@typescript-eslint/parser',
  'parserOptions': {
    'ecmaVersion': 2018,
    'sourceType': 'module',
  },
  'plugins': [
    'jsdoc',
  ],
  'rules': {
    'indent': [
      'error',
      2,
      {
        'SwitchCase': 1,
      },
    ],
    'linebreak-style': [
      'warn',
      'windows',
    ],
    'object-curly-spacing': [
      'error',
      'always',
    ],
    'arrow-parens': [
      'error',
      'as-needed',
      {
        'requireForBlockBody': true,
      },
    ],
    'require-jsdoc': 'off', // prefer eslint-plugin-jsdoc
    'valid-jsdoc': 'off', // prefer eslint-plugin-jsdoc
    '@typescript-eslint/no-explicit-any': 'off',
    'no-invalid-this': 'off', // prevent arrow functions `this` errors
    '@typescript-eslint/no-var-requires': 'off', // prefer ES6 modules
    '@typescript-eslint/camelcase': 'off', // underscore case is good for entities
    'new-cap': 'off', // allow decorator to have caps
    'require-atomic-updates': 'off', // remove false alarm 
  },
};
