
const Welcome = require('./components/Welcome').default;
const Movies = require('./components/MovieList').default;
const Movie = require('./components/Movie').default;
const SettingsPage = require('./components/Settings').default;
const settings = require('electron-settings');
const helper = require('./helpers');


module.exports.init = async function () {
  const routes = [
    { path: '/welcome', name: 'welcome', component: Welcome },
    { path: '/settings', name: 'settings', component: SettingsPage },
    { path: '/movies', name: 'movies', component: Movies },
    { path: '/movie/:id', name: 'movie', component: Movie }
  ]

  let defaultRoute = settings.get('app_id') && helper.dbExists() ? 'movies' : 'welcome';

  const router = new VueRouter({
    routes // short for `routes: routes`
  });


  new Vue({
    router,
    mounted() {
      router.push(defaultRoute);

      this.$eventBus.$on('preferences', (data) => {
        router.push('settings');
      })
    }
  }).$mount('#app')
}
