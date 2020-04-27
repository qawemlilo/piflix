
const {remote} = require('electron');
const dialog = remote.dialog;
const ipcRenderer = remote.ipcRenderer;
const mainWindow = remote.getCurrentWindow();
const settings = require('electron-settings');
const SettingsController = require('../controllers/SettingsController');
const MoviesController = require('../controllers/MoviesController');
const { PI_SERVER_URL } = require('../config');

module.exports.default = {
  template: `
<form class="text-left settings">
  <router-link role="button" :to="{ name: 'movies'}" class="close text-white mr-2" aria-label="Close">
    <span aria-hidden="true">&times;</span>
  </router-link>

  <h3>Settings</h3>

  <div class="form-group row mt-4">
    <label for="moviesDir" class="col-sm-2 col-form-label text-light">
      Movies Folder:
    </label>
    <div class="col-sm-8">
      <input type="text" readonly class="form-control-plaintext text-white" id="moviesDir" :value="moviesDir" @click="openSeedDirectory">
    </div>
    <label class="col-sm-2 p-0 col-form-label">
      <button class="btn btn-dark" @click="openSeedDirectory">
        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true" v-show="loading"></span>
        Change
      </button>
    </label>
  </div>

  <div class="form-group row mt-4">
    <label for="appDir" class="col-sm-2 col-form-label text-light">
      Video Player:
    </label>
    <div class="col-sm-9">
      <select class="form-control" v-model="selectedPlayer" @change="savePlayer">
        <option>Select</option>
        <option value="vlc">VLC</option>
        <option value="quicktime">QuickTime Player</option>
        <!-- <option value="builtin">Built-in HTML5 Player</option> -->
      </select>
    </div>
  </div>

  <div class="form-group row mt-4">
    <label for="MovieDBKey" class="col-sm-2 col-form-label text-light">
      MovieDB Key:
    </label>
    <div class="col-sm-9">
      <input type="text" placeholder="Your MovieDB api key" class="form-control-plaintext text-white" id="MovieDBKey" v-model="MovieDBKey" @keyup="updateKey()">
      <small class="form-text text-muted">Use your own themoviedb.org API key</small>
    </div>
  </div>

  <div class="form-group row mt-4">
    <label for="searchAPI" class="col-sm-2 col-form-label text-light">
      Search API:
    </label>
    <div class="col-sm-9">
      <input type="text" placeholder="Movie search API url" class="form-control-plaintext text-white" id="searchAPI" v-model="SearchAPI" @keyup="updateSearchAPI()">
      <small class="form-text text-muted">Movie search API url</small>
    </div>
  </div>
</form>

  `,

  data() {
    return {
      loading: false,
      moviesDir: settings.get('settings.moviesDir'),
      appDir: settings.get('appDir'),
      selectedPlayer: settings.get('defaultPlayer') || '',
      MovieDBKey: settings.get('MovieDBKey') || '',
      SearchAPI: settings.get('SearchAPI') || PI_SERVER_URL
    }
  },

  methods: {
    savePlayer() {
      SettingsController.set('defaultPlayer', this.selectedPlayer);
    },

    updateKey() {
      SettingsController.set('MovieDBKey', this.MovieDBKey);
    },

    updateSearchAPI() {
      SettingsController.set('SearchAPI', this.SearchAPI);
    },

    openSeedDirectory (e) {
      e.preventDefault();

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

        this.moviesDir = pathStr;
        SettingsController.saveMoviesDir(pathStr);

        MoviesController
          .loadMovies(pathStr, this.MovieDBKey)
          .then(() => {
            this.loading = false;
          })
          .catch((error) => {
            this.loading = false;
          });
      }
    },

    openAppDirectory () {
      ipcRenderer.send('openAppDirectory')
    }
  },

  watch: {
    MovieDB: function (val) {
      this.updateKey();
    }
  }
};
