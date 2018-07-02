'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VAvatar = require('../VAvatar');

var _VAvatar2 = _interopRequireDefault(_VAvatar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  functional: true,

  name: 'v-list-tile-avatar',

  props: {
    color: String,
    size: {
      type: [Number, String],
      default: 40
    },
    tile: Boolean
  },

  render: function render(h, _ref) {
    var data = _ref.data,
        children = _ref.children,
        props = _ref.props;

    data.staticClass = ('list__tile__avatar ' + (data.staticClass || '')).trim();

    var avatar = h(_VAvatar2.default, {
      props: {
        color: props.color,
        size: props.size,
        tile: props.tile
      }
    }, [children]);

    return h('div', data, [avatar]);
  }
}; // Components