const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');

module.exports = (env, argv) => {
  return {
    entry: [
      './src/app'
    ],
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'app.js'
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx'],
      plugins: [
        new TsConfigPathsPlugin()
      ]
    },
    module: {
      rules: [
        {
          test: /\.tsx?$/,
          exclude: /node_modules/,
          use: {
            loader: 'ts-loader'
          }
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin('dist', {}),
      new webpack.DefinePlugin({
        '__DEV__': JSON.stringify(argv.mode !== 'production'),
        '__PROD__': JSON.stringify(argv.mode === 'production')
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html')
      })
    ]
  };
};
