'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VProgressLinear = require('./VProgressLinear');

var _VProgressLinear2 = _interopRequireDefault(_VProgressLinear);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VProgressLinear2.default.install = function install(Vue) {
  Vue.component(_VProgressLinear2.default.name, _VProgressLinear2.default);
};

exports.default = _VProgressLinear2.default;