'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VPicker = require('./VPicker');

var _VPicker2 = _interopRequireDefault(_VPicker);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VPicker2.default.install = function install(Vue) {
  Vue.component(_VPicker2.default.name, _VPicker2.default);
};

exports.default = _VPicker2.default;