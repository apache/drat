'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VProgressCircular = require('./VProgressCircular');

var _VProgressCircular2 = _interopRequireDefault(_VProgressCircular);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VProgressCircular2.default.install = function install(Vue) {
  Vue.component(_VProgressCircular2.default.name, _VProgressCircular2.default);
};

exports.default = _VProgressCircular2.default;