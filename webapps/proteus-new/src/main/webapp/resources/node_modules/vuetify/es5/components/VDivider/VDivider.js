'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_dividers.styl');

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-divider',

  functional: true,

  mixins: [_themeable2.default],

  props: {
    inset: Boolean
  },

  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        children = _ref.children;

    data.staticClass = ('divider ' + (data.staticClass || '')).trim();

    if (props.inset) data.staticClass += ' divider--inset';
    if (props.light) data.staticClass += ' theme--light';
    if (props.dark) data.staticClass += ' theme--dark';

    return h('hr', data);
  }
};