const {remote} = require('electron');
const Menu = remote.Menu;
const SettingsController = require('../controllers/SettingsController');
const MenuController = require('../controllers/MenuController');
const template = `
<ul class="nav main-nav">
  <li class="nav-item">
    <router-link :to="{ name: 'movies'}" class="nav-link text-white">
      Movies
    </router-link>
  </li>
  <li class="nav-item link-style" :class="{dropup: ascending}" v-if="$route.name == 'movies'">
    Filter by <a class="dropdown-toggle ml-1" href="#" @click="getMenu">{{filter}}</a>
  </li>
</ul>
`;

module.exports.default = {
  template: template,

  data() {
    return {
      filter: SettingsController.get('settings.filter') || 'year',
      order: SettingsController.get('settings.order') || 'desc'
    }
  },

  methods: {
    getMenu() {
      const orderMenu = Menu.buildFromTemplate(MenuController.filterMenu(this));

      orderMenu.popup();
    },

    updateMovies() {
      this.$eventBus.$emit('update', {
        filter: this.filter,
        order: this.order
      });
    }
  },

  computed: {
    ascending() {
      return this.order === 'asc';
    }
  },

  watch: {
    filter: function () {
      this.updateMovies();
    },
    order: function () {
      this.updateMovies();
    }
  }
}
