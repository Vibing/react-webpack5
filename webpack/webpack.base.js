const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ModuleFederationPlugin } = webpack.container; // 模块联邦
const dependencies = require('../package').dependencies;
const isDev = process.env.NODE_ENV === 'development'; // 是否是开发模式

module.exports = {
  entry: path.join(__dirname, '../src/index.tsx'),
  output: {
    filename: 'js/[name].[chunkhash:8].js',
    path: path.join(__dirname, '../dist'),
    clean: true,
    publicPath: '/',
  },
  cache: {
    type: 'filesystem',
  },
  resolve: {
    extensions: ['.js', '.tsx', '.ts'],
    alias: {
      '@': path.join(__dirname, '../src'),
    },
    // 如果用的是pnpm 就暂时不要配置这个,否则会找不到模块
    modules: [path.resolve(__dirname, '../node_modules')],
  },
  module: {
    rules: [
      {
        test: /.(ts|tsx)$/,
        use: ['thread-loader', 'babel-loader'],
        include: [path.resolve(__dirname, '../src')],
      },
      // 是否需要处理 node_modules 中的语法，视情况而定
      // {
      //  test: /.(js|jsx)$/,
      //  use: 'babel-loader'
      // },
      {
        test: /\.css$/,
        enforce: 'pre',
        include: [path.resolve(__dirname, '../src')],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
        ],
      },
      {
        test: /\.less$/,
        enforce: 'pre',
        include: [path.resolve(__dirname, '../src')],
        use: [
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          'less-loader',
        ],
      },
      {
        test: /.(png|jpg|jpeg|gif|svg)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'static/images/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /.(woff2?|eot|ttf|otf)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'static/fonts/[name].[contenthash:8][ext]',
        },
      },
      {
        test: /.(mp4|webm|ogg|mp3|wav|flac|aac)$/,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 10 * 1024,
          },
        },
        generator: {
          filename: 'static/media/[name].[contenthash:8][ext]',
        },
      },
    ],
  },
  // 插件
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, '../src/index.html'),
      inject: true,
    }),

    new ModuleFederationPlugin({}),
  ],
};
