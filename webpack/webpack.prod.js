const path = require('path')
const { merge } = require('webpack-merge')
const CopyPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const { PurgeCSSPlugin } = require('purgecss-webpack-plugin')
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin')
const FileManagerPlugin = require('filemanager-webpack-plugin')
const globAll = require('glob-all')

const baseConfig = require('./webpack.base.js')
const packageJson = require('../package.json')

module.exports = merge(baseConfig, {
  mode: 'production',
  output: {
    publicPath: `/${packageJson.name}/`
  },
  optimization: {
    splitChunks: {
      // 分隔代码
      cacheGroups: {
        vendors: {
          // 提取node_modules代码
          test: /node_modules/, // 只匹配node_modules里面的模块
          name: 'vendors', // 提取文件命名为vendors,js后缀和chunkhash会自动加
          minChunks: 1, // 只要使用一次就提取出来
          chunks: 'async', // 暂时调整为async，（设置initial后MF动态js不再请求，导致MF分享失败）/ 只提取初始化就能获取到的模块,不管异步的
          minSize: 0, // 提取代码体积大于0就提取出来
          priority: 1 // 提取优先级为1
        },
        commons: {
          name: 'commons',
          minChunks: 2,
          chunks: 'async',
          minSize: 0
        }
      }
    },
    minimizer: [
      new CssMinimizerPlugin(), // 压缩css
      new TerserPlugin({
        // 压缩js
        parallel: true, // 开启多线程压缩
        terserOptions: {
          compress: {
            pure_funcs: ['console.log'] // 删除console.log
          }
        }
      })
    ]
  },
  plugins: [
    // 复制文件插件
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(__dirname, '../public'),
          to: path.resolve(__dirname, '../dist'),
          filter: (source) => {
            return !source.includes('index.html') // 忽略index.html
          }
        }
      ]
    }),
    // 抽离css的输出目录和名称
    new MiniCssExtractPlugin({
      filename: 'static/css/[name].[contenthash:8].css'
    }),
    // 清理无用css
    // new PurgeCSSPlugin({
    //   // 检测范围src
    //   paths: globAll.sync([`${path.join(__dirname, '../src')}/**/*.tsx`]),
    //   // 不删ant-开头的样式
    //   safelist: {
    //     standard: [/^ant-/]
    //   }
    // }),
    // 打包完成后，删除外层dist/deployer后 将打包产物copy至其中
    // new FileManagerPlugin({
    //   events: {
    //     onEnd: {
    //       delete: [
    //         {
    //           source: path.resolve(__dirname, '../../dist/deployer'),
    //           options: {
    //             force: true
    //           }
    //         }
    //       ],
    //       copy: [
    //         {
    //           source: path.join(__dirname, '../dist'),
    //           destination: path.join(__dirname, '../../dist/deployer')
    //         }
    //       ]
    //     }
    //   }
    // })
  ]
})
