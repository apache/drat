'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VSubheader = require('./VSubheader');

var _VSubheader2 = _interopRequireDefault(_VSubheader);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VSubheader2.default.install = function install(Vue) {
  Vue.component(_VSubheader2.default.name, _VSubheader2.default);
};

exports.default = _VSubheader2.default;