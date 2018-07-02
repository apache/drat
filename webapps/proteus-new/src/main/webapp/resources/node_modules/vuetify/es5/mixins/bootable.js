'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Bootable
 * @mixin
 *
 * Used to add lazy content functionality to components
 * Looks for change in "isActive" to automatically boot
 * Otherwise can be set manually
 */
exports.default = {
  name: 'bootable',

  data: function data() {
    return {
      isBooted: false
    };
  },

  props: {
    lazy: Boolean
  },

  watch: {
    isActive: function isActive() {
      this.isBooted = true;
    }
  },

  methods: {
    showLazyContent: function showLazyContent(content) {
      return this.isBooted || !this.lazy || this.isActive ? content : null;
    }
  }
};