const CopyWebpackPlugin = require('copy-webpack-plugin')
module.exports = {
  output: {
    libraryTarget: 'umd',
  },
  module: {
    rules: [{
      test: /\.js$/,
      loader: "babel-loader",
    }, {
      test: /\.(png|svg|jpg|gif|json|mp3|ogg|txt|wav)$/,
      loader: 'file-loader'
    }]
  },
  plugins: [
    new CopyWebpackPlugin([{
      from: "src/assets",
      to: "assets"
    }])
  ]
};
