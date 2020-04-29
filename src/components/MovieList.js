
const settings = require('electron-settings');
const MoviesController = require('../controllers/MoviesController');
const { STORAGE_ROOT } = require('../config');
const InfiniteLoading = require('vue-infinite-loading').default;
const path = require('path');
const template = `
<div id="moviesShell">
  <div class="row">
    <div class="col-2 mb-2 movie" v-for="movie in movies" v-bind:key="movie.id" @click="loadMovie(movie.id)">
      <div class="card bg-dark text-white">
        <img :src="getPoster(movie.poster)" class="card-img" alt="...">
        <div class="card-img-overlay text-left">
        </div>
      </div>
      <p class="mb-0 movie-title ellipsis" :title="movie.title">{{movie.title}}</p>
      <p class="mt-0 mb-0 p-0 movie-year text-muted">{{movie.year.substring(0, 4)}}</p>
    </div>
  </div>
  <infinite-loading @infinite="infiniteHandler" :identifier="infiniteId">
    <div slot="spinner">Loading...</div>
    <span slot="no-more"></span>
    <span slot="no-results"></span>
  </infinite-loading>
</div>
`;

module.exports.default = {

  template: template,

  components: {
    InfiniteLoading
  },

  data() {
    return {
      movies: [],
      limit: 24,
      filter: settings.get('settings.filter') || 'year',
      order: settings.get('settings.order') || 'desc',
      page: 0,
      state: null,
      infiniteId: Date.now()
    }
  },

  methods: {
    getPoster(poster) {
      if (!poster) {
        return path.resolve(__dirname,'..','assets/images/placeholder.jpg');
      }
      return `${STORAGE_ROOT}${poster}`;
    },

    loadMovie(id) {
      this.$router.push({ name: 'movie', params: { id: id }})
    },


    async infiniteHandler($state) {
      try {
        const movies = await MoviesController.fetch({
          limit: this.limit,
          filter: this.filter,
          order: this.order,
          page: this.page
        });


        if (
          this.movies.length === 0 &&
          movies.length === 0 &&
          this.page === 0 &&
          this.filter === 'year'
        ) {
          return this.$router.push('welcome');
        }

        if (movies.length) {
          this.movies = this.movies.concat(movies);
        }

        this.page += 1;

        if (movies.length < this.limit) {
          $state.complete();
        }
        else {
          $state.loaded();
        }
      }
      catch (error) {
        $state.complete();
      }
    }
  },

  mounted() {
    this.$eventBus.$on('update', async (data) => {
      // reset pagination
      this.infiniteId += 1;

      if (data.filter) {
        this.filter = data.filter
      }

      if (data.order) {
        this.order = data.order
      }

      this.movies = await MoviesController.fetch({
        limit: this.limit,
        filter: this.filter,
        order: this.order,
        page: 0
      });

      // now at page 1
      this.page = 1;
    });
  }
};
