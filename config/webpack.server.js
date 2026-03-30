const path = require('path');

module.exports = {
  entry: './server/index.js',
  output: {
    path: path.join(__dirname, 'build'),
    filename: 'server.js'
  },
  target: 'node',
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        options: {
          presets: ['@babel/preset-env']
        }
      }
    ]
  }
};