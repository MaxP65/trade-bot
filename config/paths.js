'use strict';

const path = require('path');

const PATHS = {
  src: path.resolve(__dirname, '../src'),
  build: path.resolve(__dirname, '../build'),
  modules: path.resolve(__dirname, '../node_modules'),
};

module.exports = PATHS;
