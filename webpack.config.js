const CopyWebpackPlugin = require('copy-webpack-plugin');
const path = require('path');

module.exports = {
  entry: {
    main: './src/index.js',
    levels: './src/levels.js'
  },
  output: {
    filename: '[name].js',
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: "babel-loader",
    }, {
      test: /\.(png|svg|jpg|gif|json|mp3|ogg|txt|wav)$/,
      loader: 'file-loader',
    }]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: "src/assets",
      to: "assets",
    }])
  ],
  devServer: {
    contentBase: [
      path.join(__dirname, "demo"),
    ]
  },
  performance: {
    assetFilter: function (assetFilename) {
      return !(/^assets/.test(assetFilename));
    }
  }
};
