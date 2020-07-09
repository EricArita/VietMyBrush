// tslint:disable
const withPlugins = require('next-compose-plugins');
const withTypescript = require('@zeit/next-typescript');
const withCSS = require('@zeit/next-css');
const withLess = require('@zeit/next-less');
const withBundleAnalyzer = require('@zeit/next-bundle-analyzer');
const lessToJS = require('less-vars-to-js');
const fs = require('fs');
const path = require('path');

const isDev = process.env.NODE_ENV !== 'production';
const themeVariables = lessToJS(
  fs.readFileSync(path.resolve(__dirname, `./${isDev ? 'src' : 'dist'}/client/custom-antd.less`), 'utf8'),
);

if (typeof require !== 'undefined') {
  require.extensions['.less'] = (file) => {};
  require.extensions['.css'] = (file) => {};
}

const nextConfigs = {
  webpack: (config, { dev }) => {
    if (dev) {
      config.devtool = 'cheap-module-source-map';
    }

    return config;
  },
};

module.exports = withPlugins(
  [
    withTypescript,
    [
      withLess,
      {
        lessLoaderOptions: {
          javascriptEnabled: true,
          modifyVars: themeVariables,
        },
      },
    ],
    withCSS,
    [
      withBundleAnalyzer,
      {
        analyzeServer: ['server', 'both'].includes(process.env.BUNDLE_ANALYZE),
        analyzeBrowser: ['browser', 'both'].includes(process.env.BUNDLE_ANALYZE),
        bundleAnalyzerConfig: {
          server: {
            analyzerMode: 'static',
            reportFilename: '../../bundles/server.html',
          },
          browser: {
            analyzerMode: 'static',
            reportFilename: '../bundles/client.html',
          },
        },
      },
    ],
  ],
  nextConfigs,
);
