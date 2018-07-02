'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_content.styl');

var _ssrBootable = require('../../mixins/ssr-bootable');

var _ssrBootable2 = _interopRequireDefault(_ssrBootable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Styles
exports.default = {
  name: 'v-content',

  mixins: [_ssrBootable2.default],

  props: {
    tag: {
      type: String,
      default: 'main'
    }
  },

  computed: {
    styles: function styles() {
      var _$vuetify$application = this.$vuetify.application,
          bar = _$vuetify$application.bar,
          top = _$vuetify$application.top,
          right = _$vuetify$application.right,
          footer = _$vuetify$application.footer,
          bottom = _$vuetify$application.bottom,
          left = _$vuetify$application.left;


      return {
        paddingTop: top + bar + 'px',
        paddingRight: right + 'px',
        paddingBottom: footer + bottom + 'px',
        paddingLeft: left + 'px'
      };
    }
  },

  render: function render(h) {
    var data = {
      staticClass: 'content',
      'class': this.classes,
      style: this.styles,
      ref: 'content'
    };

    return h(this.tag, data, [h('div', { staticClass: 'content--wrap' }, this.$slots.default)]);
  }
};

// Mixins