
const MoviesController = require('../controllers/MoviesController');
const PlayerController = require('../controllers/PlayerController');
const { STORAGE_ROOT } = require('../config');
const StarRating = require('vue-star-rating').default;
const log = require('electron-log');
const path = require('path');

Object.assign(console, log.functions);

const tmpl = `
  <div class="row" style="height:calc(100h-)">
    <div class="col-4">
      <img :src="getPoster(movie.poster)" class="card-img" alt="...">
    </div>
    <div class="col-8">
      <router-link role="button" :to="{ name: 'movies'}" class="close text-white mr-2" aria-label="Close">
        <span aria-hidden="true">&times;</span>
      </router-link>

      <h1>{{movie.title}}</h1>

      <ul class="list-inline text-muted">
        <li class="list-inline-item">{{movie.year?.substring(0, 4)}}</li>
        <li class="list-inline-item">&middot;</li>
        <li class="list-inline-item">
          <star-rating :star-size="12"
            :max-rating="5"
            :read-only="true"
            :show-rating="false"
            :rating="movie?.rating / 2"
            :show-rating="true">
          </star-rating>
        </li>
      </ul>
      <p>{{movie.overview}}</p>
      <div class="fixed-bottom">
        <div class="row">
          <div class="offset-md-4 col-8 mb-2">
            <div class="custom-control custom-switch">
              <input type="checkbox" class="custom-control-input" v-model="watchlist" id="customSwitch1" @change="watchLater">
              <label class="custom-control-label text-muted" style="font-size:.9rem" for="customSwitch1">Watch later</label>
            </div>
          </div>
          <div class="offset-md-4 col-8 mb-5">
            <button type="button" class="btn btn-success btn-lg" @click="playMovie(movie?.video_path)">
              <i class="fas fa-video text-white"></i> Watch Now
            </button>
            <!--
            <button type="button" class="btn btn-success btn-lg m-3">
              <i class="fas fa-photo-video"></i> Watch Trailer
            </button>
            -->
          </div>
        </div>
      </div>
    </div>
  </div>
`
module.exports.default = {

  template: tmpl,

  components: {
    StarRating
  },

  data() {
    return {
      movie: {},
      watchlist: false
    }
  },

  methods: {
    getPoster(poster) {
      if (!poster) {
        return path.resolve(__dirname,'..','assets/images/placeholder.jpg');
      }
      return `${STORAGE_ROOT}${poster}`;
    },

    playMovie(file) {
      if (!this.movie.exists()) {
        return new Notification('File not found', {
          body: 'Please make sure that your still exists in your movies folder'
        });
      }

      PlayerController.play(file);
    },

    async watchLater() {
      await this.movie.updateWatchLater(this.watchlist);
    }
  },

  mounted() {
    MoviesController.find(this.$route.params.id)
    .then((movie) => {
      this.movie = movie;
      this.watchlist = this.movie.watchlist === 'y';
    })
    .catch((error) => {
      console.error(error)
    })
  }
}
