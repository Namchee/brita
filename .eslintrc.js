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
    'babel',
    'graphql',
  ],
  'rules': {
    'indent': [
      'error',
      2,
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
    'require-jsdoc': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    'no-invalid-this': 'off',
    'babel/no-invalid-this': 'error',
  },
};
