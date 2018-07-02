'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VMenu = require('./VMenu');

var _VMenu2 = _interopRequireDefault(_VMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VMenu2.default.install = function install(Vue) {
  Vue.component(_VMenu2.default.name, _VMenu2.default);
};

exports.default = _VMenu2.default;