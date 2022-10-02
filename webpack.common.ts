import type { Configuration } from "webpack";

import * as path from 'path';

const webpack = require("webpack");

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser/');
const phaser = path.join(phaserModule, 'src/phaser.js');

const config: Configuration = {
  entry: {
    app: path.resolve(__dirname, 'src/game.ts'),
    vendor: ['phaser']
  },
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.[name].js'
  },
  target: 'web',
  module: {
    rules: [
      {
        test: /\.ts$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            include: path.join(__dirname, 'src'),
            presets: ['@babel/preset-env']
          }
        }
      },
      { // https://v4.webpack.js.org/guides/asset-management/
        test: /\.(png|jpe?g|gif|svg|xml)$/i,
        use: [
          'file-loader',
        ],
      }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    })
  ],
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'phaser': phaser,
    }
  }
};

export default config;