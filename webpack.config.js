'use strict';

module.exports = {
  entry: {
    common: './src/js/common'
  },
  output: {
    path: __dirname + '/dist/js',
    filename: '[name].js'
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: 'babel-loader',
      options: {
        presets: ['es2015'],
      }
    }]
  },
  // devtool: 'inline-source-map',
  watch: true,
  watchOptions: {
    aggregateTimeout: 100
  }
};
