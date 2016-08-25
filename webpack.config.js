'use strict';


const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');
const COMPONENT_NAME = process.env.npm_package_config_component;
const pathTo = path.join.bind(null, process.cwd());


if (!COMPONENT_NAME) {
  throw Error('<package.json>.config.component name is required');
}


const loaders = [
  {
    test: /\.css$/,
    loader: 'style!css?sourceMap&modules&localIdentName=[path][name]---[local]',
    include: [pathTo('src')]
  },
  {test: /\.json$/, loader: 'json'},
  {
    test: /\.js$/,
    loader: 'babel',
    include: [pathTo('src')]
  },
  {test: /\.(png|jpg)$/, loader: 'file?name=[name].[ext]', include: [pathTo('src')]}
];


const definePlugin = new webpack.DefinePlugin({
  'process.env': {
    NODE_ENV: JSON.stringify(process.env.NODE_ENV)
  }
});


const resolve = {extensions: ['', '.js']};
const stats = {colors: true};


const development = {
  devtool: '#source-map',

  entry: [
    pathTo('src', 'example', 'Example.js'),
    'webpack-dev-server/client?http://localhost:8080'
  ],
  output: {filename: 'bundle.js', path: pathTo('example')},
  plugins: [
    new HtmlWebpackPlugin(),
    definePlugin
  ],
  module: {loaders},
  resolve,
  stats,
  devServer: {
    historyApiFallback: true,
    stats: {
      // Do not show list of hundreds of files included in a bundle
      chunkModules: false,
      colors: true
    }
  }
};


const ghPages = {
  devtool: 'none',
  entry: pathTo('src', 'example', 'Example.js'),
  output: {filename: 'bundle.js', path: pathTo('example')},

  plugins: [
    new HtmlWebpackPlugin({
      title: 'GeoVis'
    }),
    definePlugin,
    new webpack.optimize.UglifyJsPlugin({
      compress: true,
      mangle: true,
      beautify: false,
      comments: false,
      sourceMap: false,
      compressor: {
        warnings: false
      }
    })
  ],
  module: {loaders: [
    {
      test: /\.js$/,
      loaders: ['rollup'],
      include: [pathTo('src')]
    }
  ].concat(loaders)},
  resolve,
  stats
};


const dist = {
//  devtool: '#source-map',
  devtool: 'none',
  entry: pathTo('src', 'index.js'),
  output: {
    filename: `${require(pathTo('package.json')).name}.js`,
    path: pathTo('build'),
    library: COMPONENT_NAME,
    libraryTarget: 'umd'
  },
  plugins: [
    definePlugin,
    new webpack.optimize.UglifyJsPlugin({
      compress: true,
      mangle: false,
      beautify: true,
      comments: true,
      sourceMap: false,
      compressor: {
        warnings: false
      }
    })
  ],
  module: {loaders: [
    {
      test: /\.js$/,
      loaders: ['rollup'],
      include: [pathTo('src')]
    }
  ].concat(loaders)},
  resolve,
  stats,
  externals: {
    three: {root: 'THREE', commonjs2: 'three', commonjs: 'three', amd: 'three'},
    react: {root: 'React', commonjs2: 'react', commonjs: 'react', amd: 'react'}
  }
};


const min = {
  devtool: '#source-map',
  entry: pathTo('src', 'index.js'),
  output: {
    filename: `${require(pathTo('package.json')).name}.min.js`,
    path: pathTo('build'),
    library: COMPONENT_NAME,
    libraryTarget: 'umd'
  },
  plugins: [
    definePlugin,
    new webpack.optimize.UglifyJsPlugin({
      compressor: {
        warnings: false
      }
    })
  ],
  module: {loaders},
  resolve,
  stats,
  externals: {
    react: {root: 'React', commonjs2: 'react', commonjs: 'react', amd: 'react'}
  }
};


const test = {
  output: {libraryTarget: 'commonjs2'},
  module: {loaders}
};


const configs = {development, ghPages, dist, min, test};
const build = process.env.BUILD || process.env.NODE_ENV || 'development';


module.exports = configs[build];
