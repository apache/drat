'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Delayable
 *
 * @mixin
 *
 * Changes the open or close
 * delay time for elements
 */
exports.default = {
  name: 'delayable',

  data: function data() {
    return {
      openTimeout: null,
      closeTimeout: null
    };
  },

  props: {
    openDelay: {
      type: [Number, String],
      default: 0
    },
    closeDelay: {
      type: [Number, String],
      default: 200
    }
  },

  methods: {
    /**
     * Clear any pending delay
     * timers from executing
     *
     * @return {void}
     */
    clearDelay: function clearDelay() {
      clearTimeout(this.openTimeout);
      clearTimeout(this.closeTimeout);
    },

    /**
     * Runs callback after
     * a specified delay
     *
     * @param  {String}   type
     * @param  {Function} cb
     *
     * @return {void}
     */
    runDelay: function runDelay(type, cb) {
      this.clearDelay();

      var delay = parseInt(this[type + 'Delay'], 10);

      this[type + 'Timeout'] = setTimeout(cb, delay);
    }
  }
};