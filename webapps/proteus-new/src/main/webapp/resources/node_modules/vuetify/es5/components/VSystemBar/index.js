'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VSystemBar = require('./VSystemBar');

var _VSystemBar2 = _interopRequireDefault(_VSystemBar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VSystemBar2.default.install = function install(Vue) {
  Vue.component(_VSystemBar2.default.name, _VSystemBar2.default);
};

exports.default = _VSystemBar2.default;