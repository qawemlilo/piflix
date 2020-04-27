"use strict";

module.exports.search = function (query, apiKey) {
  const MovieDB = require('moviedb')(apiKey);

  return new Promise ((resolve, reject) => {
    MovieDB.searchMovie({ query: query.title }, async (err, res) => {

      if (err) return reject(err);

      let filteredMovies = res.results;

      if (filteredMovies.length > 1 && query.year) {
        filteredMovies = filteredMovies.filter((r) => {
          return r.release_date.indexOf(query.year) > -1
        });
      }

      if (filteredMovies.length > 1) {
        filteredMovies = res.results.filter((r => r.title === query.title));
      }

      if (res.results.length && (!filteredMovies || filteredMovies.length === 0)) {
        filteredMovies = res.results.slice(0, 1)
      }

      resolve(filteredMovies);
    });
  });
};
