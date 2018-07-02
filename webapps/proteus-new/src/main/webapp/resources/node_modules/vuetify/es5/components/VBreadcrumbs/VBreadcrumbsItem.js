'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routable = require('../../mixins/routable');

var _routable2 = _interopRequireDefault(_routable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = {
  name: 'v-breadcrumbs-item',

  mixins: [_routable2.default],

  props: {
    // In a breadcrumb, the currently
    // active item should be dimmed
    activeClass: {
      type: String,
      default: 'breadcrumbs__item--disabled'
    }
  },

  computed: {
    classes: function classes() {
      return _defineProperty({
        'breadcrumbs__item': true
      }, this.activeClass, this.disabled);
    }
  },

  render: function render(h) {
    var _generateRouteLink = this.generateRouteLink(),
        tag = _generateRouteLink.tag,
        data = _generateRouteLink.data;

    return h('li', [h(tag, data, this.$slots.default)]);
  }
};