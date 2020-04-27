
module.exports.default = {
  template: `
  <div class="appModal" v-show="open">
    <button role="button" class="close text-white mr-2" aria-label="Close" @click="close()">
      <span aria-hidden="true">&times;</span>
    </button>
    <div class="content">
      <div>
        <slot></slot>
      </div>
    </div>
  </div>
  `,

  data() {
    return {
      open: false
    }
  },

  methods: {
    toggle() {
      this.open = !this.open;
    },
    close() {
      this.open = false;
    }
  }
};
