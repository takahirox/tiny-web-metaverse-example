const path = require('path');
const webpack = require('webpack');

const mode = 'development';

module.exports = [
  {
    devServer: {
      port: 8080,
      static: {
        directory: path.join(__dirname),
      }
    },
    devtool: 'source-map',
    entry: './src/index.ts',
    mode: mode,
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader',
          options: {
            allowTsInNodeModules: true
          }
        }
      ]
    },
    name: "example",
    output: {
      filename: 'example.bundle.js',
      path: path.resolve(__dirname, 'dist')
    },
    resolve: {
      extensions: [
        '.js',
        '.ts',
        '.tsx'
      ]
    }
  }
];
