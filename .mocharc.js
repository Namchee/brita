module.exports = {
  diff: true,
  exit: true,
  'check-leaks': true,
  color: true,
  reporter: 'spec',
  recursive: true,
  require: [
    'ts-node/register',
    '@babel/register',
    'regenerator-runtime'
  ],
};
