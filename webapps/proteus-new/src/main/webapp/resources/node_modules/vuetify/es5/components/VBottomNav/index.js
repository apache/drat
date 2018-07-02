'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VBottomNav = require('./VBottomNav');

var _VBottomNav2 = _interopRequireDefault(_VBottomNav);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VBottomNav2.default.install = function install(Vue) {
  Vue.component(_VBottomNav2.default.name, _VBottomNav2.default);
};

exports.default = _VBottomNav2.default;