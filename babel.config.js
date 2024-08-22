const isDev = process.env.NODE_ENV === 'development';

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3,
      },
    ],
    '@babel/preset-react',
    '@babel/preset-typescript',
  ],
  plugins: [
    isDev && require.resolve('react-refresh/babel'), // 配置react开发环境热替换
    ['@babel/plugin-proposal-decorators', { legacy: true }],
  ].filter(Boolean),
};