
const fs = require('fs');
const path = require('path');
const settings = require('electron-settings');
const Movie = require('../models/Movie');
const MovieDBService = require('../services/MovieDB');
const { MOVIE_DB_POSTER_URL,STORAGE_ROOT, PI_SERVER_URL } = require('../config');
const axios = require('axios');
const supportedExtensions = ['.mp4','.flv','.avi','.mkv'];

axios.defaults.adapter = require('axios/lib/adapters/http');

function isMovie(filename) {
  let ext = path.extname(filename);

  return supportedExtensions.includes(ext.toLowerCase());
}


const Controller =  {
  async fetch(opts) {

    if (opts && opts.filter == 'watch later') {
      opts.filter = 'favourite';
      opts.where = {
        favourite: 'y'
      };
    }

    return await Movie.search(opts);
  },


  async find(id) {
    return await Movie.find(id);
  },


  async downloadPoster(url) {
    const response =  await axios({
      method: 'get',
      url: MOVIE_DB_POSTER_URL + url,
      responseType: 'stream'
    });

    return response.data.pipe(fs.createWriteStream(STORAGE_ROOT + url))
  },


  async search(filename, apiKey) {
    let movieObj = Movie.parseFile(filename);

    if (!movieObj || !movieObj.title) {
      return null;
    }

    if (apiKey) {
      return await MovieDBService.search(movieObj, apiKey);
    }
    else {
      const { data } =  await axios({
        method: 'get',
        params: {
          title: movieObj.title,
          year: movieObj.year || '',
          uuid: settings.get('app_id')
        },
        url: settings.get('SearchAPI') || PI_SERVER_URL,
        responseType: 'json'
      });

      return data;
    }
  },


  async saveMovie(movies, videopath) {
    const firstMovie = movies[0];

    const props = {
      moviedb_id: firstMovie.id,
      title: firstMovie.title,
      overview: firstMovie.overview,
      poster: firstMovie.poster_path,
      poster_backdrop: firstMovie.backdrop_path,
      year: firstMovie.release_date,
      rating: firstMovie.vote_average,
      genres: firstMovie.genre_ids,
      video_path: videopath
    };

    let saved = await Movie.save(props);

    return await this.downloadPoster(firstMovie.poster_path);
  },


  async loadMovies(folder, moviedbKey) {
    const files = await fs.promises.readdir(folder);

    for (let file of files) {
      let fullPath = path.join(folder, file);

      if (fs.lstatSync(fullPath).isDirectory()) {
        await this.loadMovies(fullPath);
      };

      if (isMovie(file)) {
        let matches = await this.search(file, moviedbKey);

        if (matches && matches.length) {
          await this.saveMovie(matches, fullPath);
        }
      }
    }

    return true;
  }
};

module.exports = Controller;

