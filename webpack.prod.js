const path = require('path')
const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const { CleanWebpackPlugin } = require("clean-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");
const CopyPlugin = require('copy-webpack-plugin');
 
module.exports = merge(common, {
  mode: 'production',
  devtool: false,
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
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader"
        }
      },
      {
        test: [/\.vert$/, /\.frag$/],
        use: "raw-loader"
      },
      {
        test: /\.(gif|png|jpe?g|svg|xml)$/i,
        use: "file-loader"
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin({
      root: path.resolve(__dirname, "./")
    }),
    new HtmlWebpackPlugin({
      template: "./index.prod.html"
    }),
    // new CopyPlugin([
    //   { from: 'source', to: 'dest' },
    //   { from: 'other', to: 'public' },
    // ]),
    new CopyPlugin([
      {
        from: path.resolve(__dirname, './assets'),
        to: path.resolve(__dirname, './dist/assets'),
        copyUnmodified: true,
      },
    ])
  ]
});