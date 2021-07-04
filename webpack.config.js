const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  entry: ["./src/index.js"],  // 入口文件
  output: {
    filename: 'index.min.js',
    path: path.resolve(__dirname, './lib'),
    library: "component",
    libraryExport: "default",
    libraryTarget: "umd",// var this window ...
  },

  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env']
            },
          },
          // {
          //   loader: 'ts-loader',
          //   options: {
          //     // 指定特定的ts编译配置，为了区分脚本的ts配置
          //     configFile: path.resolve(__dirname, './tsconfig.json'),
          //   },
          // },
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'postcss-loader', 'css-loader']
      },
      {
        test: /\.less$/,
        use: [MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              //支持@important引入css
              importLoaders: 1
            }
          },
          'postcss-loader',
          'less-loader'
        ]
      }
    ]
  },
  // devtool: 'inline-source-map', //便于定位错误出处
  plugins: [
    new MiniCssExtractPlugin(),
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      template:'./index.html'
    })
  ],
  devServer:{
    host: process.env.HOST || '0.0.0.0',
    stats: 'errors-only', //  屏蔽多余信息
    contentBase:path.join(__dirname,'.'),
    port:9000,
  }
}