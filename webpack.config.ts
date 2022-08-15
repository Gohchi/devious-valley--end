import type { Configuration as DevServerConfiguration } from "webpack-dev-server";
import type { Configuration } from "webpack";

import * as path from 'path';
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
// const BrowserSyncPlugin = require('browser-sync-webpack-plugin');
const CopyPlugin = require("copy-webpack-plugin");

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'src/phaser.js');

const definePlugin = new webpack.DefinePlugin({
  __DEV__: JSON.stringify(JSON.parse(process.env.BUILD_DEV || 'true')),
  WEBGL_RENDERER: true, 
  CANVAS_RENDERER: true 
});

const devServer: DevServerConfiguration = {};

const config: Configuration = {
  mode: 'development',
  devServer,

  entry: {
    app: [
      path.resolve(__dirname, 'src/game.ts')
    ],
    vendor: ['phaser']
  },
	devtool: 'source-map',
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
  // watch: true,
  plugins: [
    definePlugin,
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './src/index.html',
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
    new CopyPlugin({
      patterns: [
        { from: "src/assets", to: "assets" }
      ],
    })
  ],
  module: {
    rules: [
      {
        test: /\.ts$/,
        loaders: ['babel-loader'],
        include: path.join(__dirname, 'src'),
      },
      { // https://v4.webpack.js.org/guides/asset-management/
        test: /\.(png|svg|jpg|gif)$/,
        use: [
          'file-loader',
        ],
      }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    }
  },
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'phaser': phaser,
    }
  }
 };

export default config;