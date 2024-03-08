const { composePlugins, withNx } = require('@nx/webpack');
const { withReact } = require('@nx/react');

const NodePolyfillPlugin = require('node-polyfill-webpack-plugin')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const TerserPlugin = require("terser-webpack-plugin");


// Nx plugins for webpack.
module.exports = composePlugins(
  withNx(),
  withReact({
    // Uncomment this line if you don't want to use SVGR
    // See: https://react-svgr.com/
    // svgr: false
  }),
  (config) => {
    // Update the webpack config as needed here.
    // e.g. `config.plugins.push(new MyPlugin())`
    config.plugins.push(new NodePolyfillPlugin());
    config.plugins.push(new BundleAnalyzerPlugin());

    config.optimization = {
      splitChunks: {
        chunks: 'all',
        minSize: 10000,
        maxSize: 250000,
      },
      minimize: true,
      minimizer: [new TerserPlugin()],
    }

    config.resolve.fallback = { "fs": false };
    config.loader = {
      test: /plugin\.css$/,
      loaders: ['style-loader', 'css'],
    }
    return config;
  },
);
