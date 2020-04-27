
const template = `
<ul class="list-inline settings-menu">
  <li class="list-inline-item">
    <router-link :to="{ name: 'settings'}" class="text-white">
       <i class="fas fa-cog text-white"></i>
    </router-link>
  </li>
  <!--
  <li class="list-inline-item">
    <router-link :to="{ name: 'welcome'}" class="text-white">
      Welcome
    </router-link>
  </li>
  -->
</ul>
`;

module.exports.default = {
  template: template,

  methods: {
  }
}
