'use strict';

const { merge } = require('webpack-merge');

const common = require('./webpack.common.js');
const PATHS = require('./paths');

// Merge webpack configuration files
const config = (env, argv) =>
  merge(common, {
    resolve: {
      fallback: {
        "crypto": require.resolve("crypto-browserify"),
        "stream": require.resolve("stream-browserify"),
        "zlib": require.resolve("browserify-zlib"),
        "https": require.resolve("https-browserify"),
        "http": require.resolve("stream-http"),
        "fs": require.resolve("browserify-fs"),
        "readline": require.resolve("readline-browserify"),
        "path": require.resolve("path-browserify"),
        "buffer": require.resolve("buffer"),
        //"os": require.resolve("os-browserify"),
      } 
    },
    entry: {
      popup: PATHS.src + '/popup.js',
      options: PATHS.src + '/options.js',
      items: PATHS.src + '/items.js',
      steamContentScript: PATHS.src + '/content/steamContentScript.js',
      proxyContentScript: PATHS.src + '/content/proxyContentScript.js',
      background: PATHS.src + '/background.js',
      bot: PATHS.src + '/bot.js',
      hacktimer: PATHS.modules + '/hacktimer/HackTimer.js',
      telegrambot: PATHS.src + '/statistics/telegrambot.js',
    },
    devtool: argv.mode === 'production' ? false : 'source-map',
  });

module.exports = config;
