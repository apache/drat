'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_avatars.styl');

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _helpers = require('../../util/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mixins
exports.default = {
  name: 'v-avatar',

  functional: true,

  mixins: [_colorable2.default],

  props: {
    size: {
      type: [Number, String],
      default: 48
    },
    tile: Boolean
  },

  render: function render(h, _ref) {
    var data = _ref.data,
        props = _ref.props,
        children = _ref.children;

    data.staticClass = ('avatar ' + (data.staticClass || '')).trim();
    data.style = data.style || {};

    if (props.tile) data.staticClass += ' avatar--tile';

    var size = (0, _helpers.convertToUnit)(props.size);
    data.style.height = size;
    data.style.width = size;
    data.class = [data.class, _colorable2.default.methods.addBackgroundColorClassChecks.call(props, {}, props.color)];

    return h('div', data, children);
  }
};