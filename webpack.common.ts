import type { Configuration } from "webpack";

const webpack = require("webpack");
const path = require("path");

const config: Configuration = {
  entry: {
    app: [
      path.resolve(__dirname, 'src/game.ts')
    ],
    vendor: ['phaser']
  },
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: 'bundle.js'
  },
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
  // // target: 'node',
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    })
  ]
};

export default config;