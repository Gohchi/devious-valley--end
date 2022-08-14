const webpack = require("webpack");
const path = require("path");

module.exports = {
  entry: {
    app: [path.resolve(__dirname, 'src/game.ts')],
    vendor: ['phaser']
  },
  output: {
    pathinfo: true,
    path: path.resolve(__dirname, 'dist'),
    publicPath: './dist/',
    filename: 'bundle.js'
  },
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: ['babel-loader'],
        include: path.join(__dirname, 'src')
      },
      // {
      //   test: /\.ts$/,
      //   exclude: /node_module/,
      //   use: 'ts-loader'
      // }
    ]
  },
  node: {
    fs: 'empty',
    net: 'empty',
    tls: 'empty'
  },
  // target: 'node',
  optimization: {
    splitChunks: {
      name: 'vendor',
      chunks: 'all'
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      CANVAS_RENDERER: JSON.stringify(true),
      WEBGL_RENDERER: JSON.stringify(true)
    })
  ]
}
