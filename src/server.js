const http = require('http');
const pump = require('pump');
const rangeParser = require('range-parser');
const fs = require('fs');
const MoviesController = require('./controllers/MoviesController');


const server = http.createServer(async function (req, res) {
  if (req.headers.origin) res.setHeader('Access-Control-Allow-Origin', req.headers.origin)

  let movieID = Number(req.url.slice(1));
  let movie = await MoviesController.find(movieID);

  if (!movie) {
    res.statusCode = 404
    res.end('404')
    return
  }

  const stats = fs.statSync(movie.video_path);

  var range = req.headers.range && rangeParser(stats.size, req.headers.range)[0];

  res.setHeader('Accept-Ranges', 'bytes')
  res.setHeader('Content-Type', 'video/mp4')

  if (!range) {
    res.setHeader('Content-Length', stats.size);

    if (req.method === 'HEAD') return res.end()
    pump(fs.createReadStream(movie.video_path), res)
    return
  }

  res.statusCode = 206
  res.setHeader('Content-Length', range.end - range.start + 1)
  res.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + stats.size)
  if (req.method === 'HEAD') return res.end()
  pump(fs.createReadStream(movie.video_path, range), res)
})



server.listen(0, function () {
  console.log('Playback server running on port ' + server.address().port)
})

module.exports = server;
