// REQUIRE
const path                            = require('path');
const HtmlWebpackPlugin               = require('html-webpack-plugin');
const { CleanWebpackPlugin }          = require('clean-webpack-plugin');
const CopyWebpackPlugin               = require('copy-webpack-plugin');
const MiniCssExtractPlugin            = require('mini-css-extract-plugin');
const OptimizeCssAssetWebpackPlugin   = require('optimize-css-assets-webpack-plugin');
const TerserWebpackPlugin             = require('terser-webpack-plugin');

// CONST
const isDev = process.env.NODE_ENV === 'development';
const isProd = !isDev;

const optimization = () => {
  const config = {
    splitChunks: {
      chunks: 'all'
    }
  };

  if (isProd) {
    config.minimizer = [
      new OptimizeCssAssetWebpackPlugin(),
      new TerserWebpackPlugin()
    ]
  }

  return config;
};

const cssLoaders = extra => {
  const loaders = [
    {
      loader: MiniCssExtractPlugin.loader,
      options: {
        hmr: isDev,
        reloadAll: true
      },
    },
    'css-loader'
  ]

  if (extra) {
    loaders.push(extra)
  }

  return loaders;
};

// LOGIC
module.exports = {
  context: path.resolve(__dirname, 'app'),
  mode: 'development',

  entry: {
    main: './js/index.js',
  },

  output: {
    filename: 'js/[name].js',
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/'
  },

  resolve: {
    alias: {
      "%modules%": path.resolve(__dirname, "./app/blocks/modules"),
      "%components%": path.resolve(__dirname, "./app/blocks/components")
    }
  },

  optimization: optimization(),
  devServer: {
    port: 4200,
    open: true,
    hot: isDev,
    historyApiFallback: true
  },

  plugins: [
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: './index.html'
    }),
    new CleanWebpackPlugin(),
    new CopyWebpackPlugin({
      patterns: [{
          from: path.resolve(__dirname, './app/img/'),
          to: path.resolve(__dirname, 'dist/img/')
        },
      ],
    }),
    new MiniCssExtractPlugin({
      filename: 'styles/[name].css',
    })
  ],

  module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: cssLoaders()
      },
      {
        test: /\.s[ac]ss$/i,
        use: cssLoaders('sass-loader')
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: ['file-loader']
      },
      {
        test: /\.(ttf|woff|woff2|eot)$/i,
        use: {
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'fonts/'
          },
        },
      },
      {
        test: /\.xml$/,
        use: ['xml-loader']
      },
    ]
  }
};