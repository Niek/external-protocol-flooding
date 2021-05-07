/* eslint-disable */
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const TerserPlugin = require('terser-webpack-plugin')
const webpack = require('webpack')

const srcDir = 'src'
const entryFile = 'index.tsx'
const distDir = 'dist'

module.exports = (env, argv) => {
  const { mode = 'development' } = argv;
  const isProduction = mode === 'production';

  // Styles
  const styleLoader = (modules) => [
    // isProduction ? {
    //   loader: MiniCssExtractPlugin.loader,
    // } : 
    { loader: 'style-loader' },
    {
      loader: 'css-loader',
      options: {
        modules,
        sourceMap: !isProduction, 
      }
    },
    {
      loader: 'postcss-loader',
      options: {
        sourceMap: !isProduction,
      },
    }
  ]

  // Plugins
  const plugins = [
    new HtmlWebpackPlugin({
      template: path.join(__dirname, srcDir, 'index.html')
    }),
  ]

  return {
    mode,
    entry: {
      app: path.join(__dirname, srcDir, entryFile)
    },
    target: 'web',
    resolve: {
      extensions: ['.ts', '.tsx', '.js'],
      modules: [path.resolve(__dirname, srcDir), 'node_modules']
    },
    module: {
      rules: [
        {
          test: /\.(tsx|ts)?$/,
          use: 'ts-loader',
          exclude: '/node_modules/'
        },
        {
          test: /\.(s?css)$/,
          exclude: /\.module\.css$/,
          use: styleLoader(false)
        },
        {
          test: /\.module\.css$/,
          use: styleLoader(true)
        },
        {
          test: /\.(png|jpg|pdf|svg)$/,
          use: [
            {
              loader: 'file-loader',
              options: {
                name: '[name].[ext]',
                outputPath: 'assets/'
              }
            }
          ]
        }
      ],
    },
    output: {
      filename: 'bundle.[hash].js',
      path: path.resolve(__dirname, distDir),
      publicPath: '/',
    },
    devtool: undefined, // isProduction ? undefined : 'inline-source-map',
    devServer: {
      index: 'index.html',
      contentBase: path.join(__dirname, distDir),
      compress: true,
      historyApiFallback: true,
      port: 3000,
    },
    plugins,
    optimization: {
      minimizer: [
        new TerserPlugin({
          extractComments: true,
          terserOptions: {
            sourceMap: false,
            compress: true,
            output: {
              comments: false,
            },
          },
        }),
      ],
    },
  }
}