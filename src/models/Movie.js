
const oleoo = require('oleoo');
const fs = require('fs');
const BaseModel = require('./BaseModel');


class Movie extends BaseModel {
  table = 'movies';

  constructor(opts) {
    super(opts);
  }

  parseFile(filename) {
    let release = filename ? oleoo.parse(filename) : filename;

    return release;
  }

  async updateWatchLater(later) {
    await this.update({
      watchlist: later ? 'y' : 'n'
    });
  }

  exists() {
    return fs.existsSync(this.video_path);
  }
}


module.exports = (new Movie);


