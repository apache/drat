'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_app.styl');

var _appTheme = require('./mixins/app-theme');

var _appTheme2 = _interopRequireDefault(_appTheme);

var _appBreakpoint = require('./mixins/app-breakpoint');

var _appBreakpoint2 = _interopRequireDefault(_appBreakpoint);

var _resize = require('../../directives/resize');

var _resize2 = _interopRequireDefault(_resize);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Component level mixins


// Directives


exports.default = {
  name: 'v-app',

  mixins: [_appBreakpoint2.default, _appTheme2.default],

  directives: {
    Resize: _resize2.default
  },

  props: {
    id: {
      type: String,
      default: 'app'
    },
    dark: Boolean
  },

  computed: {
    classes: function classes() {
      return _defineProperty({}, 'theme--' + (this.dark ? 'dark' : 'light'), true);
    }
  },

  mounted: function mounted() {
    this.$vuetify.dark = this.dark;
  },


  watch: {
    dark: function dark() {
      this.$vuetify.dark = this.dark;
    }
  },

  render: function render(h) {
    var data = {
      staticClass: 'application',
      'class': this.classes,
      attrs: { 'data-app': true },
      domProps: { id: this.id },
      directives: [{
        name: 'resize',
        value: this.onResize
      }]
    };

    var wrapper = h('div', { staticClass: 'application--wrap' }, this.$slots.default);

    return h('div', data, [wrapper]);
  }
};