const path = require('path');
const webpackNodeExternals = require('webpack-node-externals');
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin');

const serverConfig = {
  target: 'node',
  externals: [webpackNodeExternals()],
  mode: 'production',
  entry: './src/server/index.ts',
  output: {
    filename: 'index.js',
    path: path.resolve(__dirname, 'build'),
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      controllers: path.resolve(__dirname, 'src/server/controllers'),
      model: path.resolve(__dirname, 'src/server/database/model'),
      entity: path.resolve(__dirname, 'src/server/entity'),
      repository: path.resolve(__dirname, 'src/server/repository'),
      services: path.resolve(__dirname, 'src/server/services'),
      botServices: path.resolve(__dirname, 'src/server/services/bot'),
      utils: path.resolve(__dirname, 'src/server/utils'),
      config: path.resolve(__dirname, 'src/server/config'),
      routes: path.resolve(__dirname, 'src/server/routes'),
    },
  },
  plugins: [
    new FilterWarningsPlugin({
      exclude: [
        /mongodb/,
        /mssql/,
        /mysql/,
        /mysql2/,
        /oracledb/,
        /pg-native/,
        /pg-query-stream/,
        /redis/,
        /react-native-sqlite-storage/,
        /sql/,
        /sqlite3/,
      ],
    }),
  ],
};

module.exports = function(env) {
  if (!env.platform) {
    throw new Error('Please specify the platform');
  }

  return env.platform === 'node' ? serverConfig : null;
};
