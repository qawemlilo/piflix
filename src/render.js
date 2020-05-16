
const {ipcRenderer} = require('electron');
const app =  require('./app');
const mainMenu =  require('./components/Menu');
const TitleBar =  require('./components/TitleBar');
const Modal =  require('./components/Modal');
const MoviePlayer =  require('./components/Player');
const VueStarRating = require('vue-star-rating');

Vue.component('main-menu', mainMenu.default);
Vue.component('settings-menu', TitleBar.default);
Vue.component('star-rating', VueStarRating.default);
Vue.component('app-modal', Modal.default);
Vue.component('movie-player', MoviePlayer.default);

Vue.prototype.$eventBus = new Vue();

app.init();

ipcRenderer.on('preferences', function (e) {
  Vue.prototype.$eventBus.$emit('preferences');
})

ipcRenderer.on('fullscreenChanged', function (e, fullscreen) {
  const mainMenuDiv = document.querySelector('.main-menu');
  const mainContentDiv = document.querySelector('.main-content');

  if (fullscreen) {
    mainMenuDiv.classList.remove("smallscreen");
    mainContentDiv.classList.add("fullscreen");
  }
  else {
    mainMenuDiv.classList.add("smallscreen");
    mainContentDiv.classList.remove("fullscreen");
  }
});




