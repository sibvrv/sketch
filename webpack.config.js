const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const TsConfigPathsPlugin = require('tsconfig-paths-webpack-plugin');
const autoprefixer = require('autoprefixer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');


module.exports = (env, argv) => {
  const CSS_MAPS = argv.mode !== 'production';

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
                  sourceMap: CSS_MAPS,
                  importLoaders: 1,
                  minimize: true
                }
              },
              {
                loader: `postcss-loader`,
                options: {
                  sourceMap: CSS_MAPS,
                  plugins: () => {
                    autoprefixer({browsers: ['last 2 versions']});
                  }
                }
              },
              {
                loader: 'less-loader',
                options: {sourceMap: CSS_MAPS}
              }
            ]
          })
        },
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
