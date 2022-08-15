import type { Configuration } from 'webpack';

import * as path from 'path';
import common from './webpack.common';
const merge = require('webpack-merge');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
 
const config: Configuration = merge(common, {
  mode: 'production',
  // devtool: false,
	devtool: 'source-map', // remove later

  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: './',
    filename: 'bundle.min.js'
  },
  performance: {
    maxEntrypointSize: 900000,
    maxAssetSize: 900000
  },
  optimization: {
    minimizer: [
      new TerserPlugin({
        terserOptions: {
          output: {
            comments: false
          }
        }
      })
    ]
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: 'raw-loader'
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: 'file-loader'
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, './')
    }),
    new HtmlWebpackPlugin({
      template: 'src/index.webpack.html'
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