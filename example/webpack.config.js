// Run with "webpack-dev-server --hot --inline --colors"

var path = require("path");
var webpack = require("webpack");

module.exports = {
  entry: "./app",
  output: {
    path: path.join(__dirname, "output"),
    filename: "bundle.js"
  },
  resolveLoader: {
    alias: {
      "react-proxy-plus": path.join(__dirname, "..")
    }
  },
  resolve: {
    extensions: ["", ".jsx", ".js"]
  },
  module: {
    loaders: [
      {
        test: /\.jsx$/,
        loader: "jsx-loader"
      },
      {
        test: /\.scss$/,
        loader: 'style-loader!css-loader!sass-loader?outputStyle=expanded&' +
        'includePaths[]=' +
        (path.resolve(__dirname, './app/bower_components')) + '&' +
        'includePaths[]=' +
        (path.resolve(__dirname, './node_modules'))
      }
    ]
  }
};
