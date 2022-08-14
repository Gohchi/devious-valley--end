const { SourceMapDevToolPlugin } = require('webpack');
const merge = require('webpack-merge')
const common = require('./webpack.common.js')
const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BrowserSyncPlugin = require('browser-sync-webpack-plugin')

// Phaser webpack config
const phaserModule = path.join(__dirname, '/node_modules/phaser/')
const phaser = path.join(phaserModule, 'src/phaser.js')

module.exports = merge(common, {
  mode: 'development',
  watch: true,
  devtool: false,
  resolve: {
    extensions: ['.ts', '.js'],
    alias: {
      'phaser': phaser,
    }
  },
  plugins: [
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
    new BrowserSyncPlugin({
      host: process.env.IP || 'localhost',
      port: process.env.PORT || 3000,
      server: {
        baseDir: ['./', './build']
      }
    }),
    new SourceMapDevToolPlugin({
      filename: '[file].map',
    })
  ]
})