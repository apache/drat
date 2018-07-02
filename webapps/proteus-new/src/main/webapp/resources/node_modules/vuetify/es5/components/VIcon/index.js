'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VIcon = require('./VIcon');

var _VIcon2 = _interopRequireDefault(_VIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VIcon2.default.install = function install(Vue) {
  Vue.component(_VIcon2.default.name, _VIcon2.default);
};

exports.default = _VIcon2.default;