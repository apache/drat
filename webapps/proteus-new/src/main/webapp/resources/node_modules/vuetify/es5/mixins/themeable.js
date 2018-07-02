'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'themeable',

  props: {
    dark: Boolean,
    light: Boolean
  },

  computed: {
    themeClasses: function themeClasses() {
      return {
        'theme--light': this.light,
        'theme--dark': this.dark
      };
    }
  }
};