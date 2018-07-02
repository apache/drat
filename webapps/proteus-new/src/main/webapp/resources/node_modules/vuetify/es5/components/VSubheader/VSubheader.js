'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_subheaders.styl');

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-subheader',

  functional: true,

  mixins: [_themeable2.default],

  props: {
    inset: Boolean
  },

  render: function render(h, _ref) {
    var data = _ref.data,
        children = _ref.children,
        props = _ref.props;

    data.staticClass = ('subheader ' + (data.staticClass || '')).trim();

    if (props.inset) data.staticClass += ' subheader--inset';
    if (props.light) data.staticClass += ' theme--light';
    if (props.dark) data.staticClass += ' theme--dark';

    return h('div', data, children);
  }
};