// webpack.dev.js
const webpack = require('webpack');
const path = require('path');
const { merge } = require('webpack-merge');
const baseConfig = require('./webpack.base.js');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

module.exports = merge(baseConfig, {
  mode: 'development',
  devtool: 'eval-cheap-module-source-map',
  output: {
    publicPath: 'http://localhost:3000/',
  },
  plugins: [
    // 热更新
    new ReactRefreshWebpackPlugin(),
    // new webpack.HotModuleReplacementPlugin()
  ],
  devServer: {
    port: 3000,
    compress: false,
    hot: true,
    open: true,
    historyApiFallback: true,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    },
    static: [
      {
        directory: path.join(__dirname, '../public'),
      },
      // WARN: 添加这个配置,方便单独启动子应用时,可以拉取到国际化和图标资源, 千万不要配置到prod中
      {
        directory: path.join(__dirname, '../../main/src/assets'),
        publicPath: '/assets',
      }
    ],
  },
});
