import type { Configuration } from 'webpack';

import * as path from 'path';
import common from './webpack.common';
const merge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
 
const config: Configuration = merge(common, {
  mode: 'production',
  devtool: false,

  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  },
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    filename: 'bundle.[name].min.js'
  },
  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.webpack.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        html5: true,
        minifyCSS: true,
        minifyJS: true,
        minifyURLs: true,
        removeComments: true,
        removeEmptyAttributes: true
      },
      hash: true
    }),
    new CopyPlugin({
      patterns: [
        // { from: 'src/assets', to: 'assets' }
        { from: 'src/assets/favicon.ico', to: 'assets/favicon.ico' }
      ],
    })
  ]
});

export default config;