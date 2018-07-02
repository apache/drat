'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VParallax = require('./VParallax');

var _VParallax2 = _interopRequireDefault(_VParallax);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VParallax2.default.install = function install(Vue) {
  Vue.component(_VParallax2.default.name, _VParallax2.default);
};

exports.default = _VParallax2.default;