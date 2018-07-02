'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VSlider = require('./VSlider');

var _VSlider2 = _interopRequireDefault(_VSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VSlider2.default.install = function install(Vue) {
  Vue.component(_VSlider2.default.name, _VSlider2.default);
};

exports.default = _VSlider2.default;