const { VueLoaderPlugin } = require('vue-loader');
const path = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');
const {BaseHrefWebpackPlugin} = require('base-href-webpack-plugin');

const env = process.env.NODE_ENV;

const config = {
  entry: path.join(__dirname, './src', 'main.js'),
  mode: env,
  output: {
    publicPath: './',
  },
  optimization: {
    splitChunks: {
      // Must be specified for HtmlWebpackPlugin to work correctly.
      // See: https://github.com/jantimon/html-webpack-plugin/issues/882
      chunks: 'all',
    },
  },
  module: {
    rules: [
      {
        test: /\.vue$/,
        loader: 'vue-loader',
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        include: [path.join(__dirname, './src')],
      },
      
    ],
  },
  plugins: [
    new VueLoaderPlugin(),
    new HtmlWebpackPlugin({
      filename: path.join(__dirname, 'dist', 'index.html'),
      template: path.join(__dirname, 'public', 'index.html'),
      inject: true,
    }),
    new BaseHrefWebpackPlugin({baseHref:'./'})
  ],
};

module.exports = config;