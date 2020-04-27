"use strict";

const path = require('path');
const packageJSON = require('../package.json');
const APP_VERSION = packageJSON.version;

module.exports = {
  STORAGE_ROOT: getRootDir(),
  STORAGE_IMAGES: path.join(getRootDir(), 'images'),
  DB_PATH: path.join(getRootDir(), 'movies.sqlite3'),

  MOVIE_DB_POSTER_URL: 'https://image.tmdb.org/t/p/w600_and_h900_bestv2',
  MOVIE_DB_KEY: process.env.moviedb || '',

  APP_VERSION:  APP_VERSION,
  APP_NAME:  packageJSON.productName,
  PRODUCT_NAME:  packageJSON.productName,
  CRASH_REPORT_URL: 'https://161.35.37.41/crash-report',
  APP_COPYRIGHT: 'Copyright © 2020 Raging Flame Solutions',

  APP_PATH: process.execPath,

  IS_PRODUCTION: isProduction(),

  ANNOUNCEMENT_URL: '',
  AUTO_UPDATE_URL: '',

  APP_ICON: path.join(__dirname, 'assets/images/icon' + getIconExt()),


  GITHUB_URL: 'https://github.com/qawemlilo/piflix',
  GITHUB_URL_ISSUES: 'https://github.com/qawemlilo/piflix/issues',
  HOME_PAGE_URL: 'https://github.com/qawemlilo/piflix',
  UPDATES_URL: 'https://github.com/qawemlilo/piflix/releases',

  PI_SERVER_URL: 'http://161.35.37.41/movies'
};



function getRootDir() {
  let home = (process.platform === 'win32') ? 'USERPROFILE' : 'HOME';
  let rootDir = process.env[home];
  let homeDir = '';

  if (isProduction()) {
    homeDir = path.join(rootDir, '.pimovies');
  }
  else {
    homeDir = path.join(__dirname, 'data');
  }

  return homeDir;
}



function isProduction () {
  if (!process.versions.electron) {
    // Node.js process
    return false
  }
  if (process.platform === 'darwin') {
    return !/\/Electron\.app\//.test(process.execPath)
  }
  if (process.platform === 'win32') {
    return !/\\electron\.exe$/.test(process.execPath)
  }
  if (process.platform === 'linux') {
    return !/\/electron$/.test(process.execPath)
  }
}

function getIconExt () {
  return process.platform === 'win32' ? '.ico' : '.png'
}
