const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env, argv) => {
  const sourceMap = argv.mode !== 'production';

  return {
    entry: [
      './src/app'
    ],
    output: {
      path: path.resolve(__dirname, './dist'),
      filename: 'app.js'
    },
    resolve: {
      extensions: ['.js', '.ts', '.tsx', '.less'],
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
        },
        {
          // Transform our own .(less|css) files with PostCSS and CSS-modules
          test: /\.(less|css)$/,
          include: [
            path.resolve(__dirname, './src/ui')
          ],
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {
                  modules: true,
                  sourceMap,
                  importLoaders: 1,
                  minimize: true
                }
              },
              {
                loader: `postcss-loader`,
                options: {
                  sourceMap
                }
              },
              {
                loader: 'less-loader',
                options: {
                  sourceMap
                }
              }
            ]
          })
        },
        {
          test: /\.(less|css)$/,
          exclude: [
            path.resolve(__dirname, './src/ui')
          ],
          use: ExtractTextPlugin.extract({
            fallback: 'style-loader',
            use: [
              {
                loader: 'css-loader',
                options: {sourceMap, importLoaders: 1, minimize: true}
              },
              {
                loader: `postcss-loader`,
                options: {
                  sourceMap
                }
              },
              {
                loader: 'less-loader',
                options: {sourceMap}
              }
            ]
          })
        },
        {
          test: /\.json$/,
          use: 'json-loader'
        },
        {
          test: /\.(xml|html|txt|md)$/,
          use: 'raw-loader'
        },
        {
          test: /\.(svg|woff2?|ttf|eot|jpe?g|png|gif)(\?.*)?$/i,
          use: argv.mode === 'production' ? 'file-loader' : 'url-loader'
        }
      ]
    },
    plugins: [
      new CleanWebpackPlugin('dist', {}),
      new webpack.DefinePlugin({
        '__DEV__': JSON.stringify(argv.mode !== 'production'),
        '__PROD__': JSON.stringify(argv.mode === 'production')
      }),
      new ExtractTextPlugin({
        filename: 'style.css',
        allChunks: true,
        disable: argv.mode !== 'production'
      }),
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, './src/index.html')
      })
    ]
  };
};
