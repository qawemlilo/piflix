
const settings = require('electron-settings');


const Controller =  {
  saveMoviesDir(dir) {
    settings.set('settings', {
      moviesDir: dir
    });
  },

  saveAppDir(appDir) {
    settings.set('appDir', appDir);
  },

  get(key) {
    return settings.get(key);
  },

  set(key, val) {
    return settings.set(key, val);
  }
};

module.exports = Controller;
