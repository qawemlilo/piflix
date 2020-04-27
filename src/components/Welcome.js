
const {remote} = require('electron');
const dialog = remote.dialog;
const mainWindow = remote.getCurrentWindow();
const SettingsController = require('../controllers/SettingsController');
const settings = require('electron-settings');
const MoviesController = require('../controllers/MoviesController');
const uuid = require('../services/uuid');
const log = require('electron-log');

Object.assign(console, log.functions);

module.exports.default = {
  template: `
  <div class="welcome mb-4 text-center" style="margin-top:20%;z-index:9999">
    <h1>Welcome to 🎬 PiMovies</h1>
    <p>To get started, choose to folder that contains all your movies</p>

    <div class="row mt-5 align-items-center">
      <div class="col">
        <p>
          <i class="fas fa-folder-open text-white" style="font-size:3rem"></i>
        </p>

        <button type="button" @click="openSeedDirectory" class="btn btn-primary btn-md" :class="{ disabled: loading }">
          <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-show="loading"></span>
          Select movies folder
        </button>
      </div>
    </div>
  </div>
  `,

  data() {
    return {
      loading: false,
      moviesDir: ''
    }
  },

  methods: {

    openSeedDirectory () {
      const opts = process.platform === 'darwin'
        ? {
          title: 'Select a folder containing all your movies',
          properties: ['openDirectory']
        }
        : {
          title: 'Select a folder containing all your movies',
          properties: ['openDirectory']
        }

      const selectedPath = dialog.showOpenDialogSync(mainWindow, opts);

      if (selectedPath) {
        let pathStr = '';
        this.loading = true;

        if (selectedPath instanceof Array) {
          pathStr = selectedPath[0];
        }
        else {
          pathStr = selectedPath;
        }

        SettingsController.saveMoviesDir(pathStr);

        MoviesController
          .loadMovies(pathStr)
          .then(() => {
            settings.set('app_id', uuid.create());
            this.$router.push('movies');
          })
          .catch((error) => {
            console.error(error)
          });
      }
    }
  }
};
