import type { Configuration as DevServerConfiguration } from 'webpack-dev-server';
import type { Configuration } from 'webpack';

import common from './webpack.common';
const merge = require('webpack-merge');

const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  WEBGL_RENDERER: true, 
  CANVAS_RENDERER: true 
});

const devServer: DevServerConfiguration = {};

const config: Configuration = merge(common, {
  mode: 'development',
  devServer,

	devtool: 'source-map',
  plugins: [
    definePlugin,
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.webpack.html',
      chunks: ['vendor', 'app'],
      chunksSortMode: 'manual',
      minify: {
        removeAttributeQuotes: false,
        collapseWhitespace: false,
        html5: false,
        minifyCSS: false,
        minifyJS: false,
        minifyURLs: false,
        removeComments: false,
        removeEmptyAttributes: false
      },
      hash: false
    }),
    // new BrowserSyncPlugin({
    //   host: process.env.IP || 'localhost',
    //   port: process.env.PORT || 3000,
    //   server: {
    //     // baseDir: ['./', './build']
    //     baseDir: ['./dist']
    //   }
    // }),
    // new CopyPlugin({
    //   patterns: [
    //     { from: 'src/assets', to: 'assets' },
    //   ],
    // })
  ]
});

export default config;