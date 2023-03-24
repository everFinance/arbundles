const path = require("path");
const webpack = require("webpack");

module.exports = {
  entry: ["./webIndex.ts"],
  devtool: "source-map",
  mode: "production",
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: "ts-loader",
        exclude: [
          /node_modules/,
          path.resolve(__dirname, "file/"),
          path.resolve(__dirname, "esm/"),
        ],
      },
    ],
  },
  // optimization: {
  //     minimize: false,
  //     mangleExports: false,
  // },
  resolve: {
    extensions: [".ts", ".js"],
    alias: {
      process: "process/browser",
      crypto: "crypto-browserify",
      stream: "stream-browserify",
    },
    fallback: {
      crypto: require.resolve("crypto-browserify"),
      stream: require.resolve("stream-browserify"),
      events: require.resolve("events/"),
      buffer: require.resolve("buffer/"),
      // "assert": require.resolve('assert/'),
      process: require.resolve("process/browser"),
      util: require.resolve("util"),
      zlib: false,
      path: false,
    },
  },
  plugins: [
    new webpack.ProvidePlugin({
      process: "process/browser",
      Buffer: ["buffer", "Buffer"],
    }),
  ],
  output: {
    filename: "bundle.js",
    path: __dirname,
    libraryTarget: "umd",
    library: "Arbundles",
  },
};
