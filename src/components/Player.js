
module.exports.default = {
  template: `
  <div class="player-container appModal" v-show="open">
    <button role="button" class="close text-white mr-2" aria-label="Close" @click="close()" style="position:relative;background:transparent;z-index:999999">
      <span aria-hidden="true">&times;</span>
    </button>
    <iframe
    :src="movie" style="position:fixed; top:0; left:0; bottom:0; right:0; width:100%; height:100%; border:none; margin:0; padding:0; overflow:hidden; z-index:999998;" allowfullscreen controls>
    </iframe>
  </div>
  `,

  data() {
    return {
      open: false,
      movie: ''
    }
  },

  methods: {
    toggle() {
      this.open = !this.open;
    },
    close() {
      this.movie = '';
      this.open = false;
    }
  },

  mounted() {
    this.$eventBus.$on('play-movie', (movie) => {
      this.movie = movie;
      this.open = true;
    });
  }
};
