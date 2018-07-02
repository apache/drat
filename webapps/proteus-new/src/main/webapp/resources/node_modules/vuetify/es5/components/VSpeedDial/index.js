'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VSpeedDial = require('./VSpeedDial');

var _VSpeedDial2 = _interopRequireDefault(_VSpeedDial);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VSpeedDial2.default.install = function install(Vue) {
  Vue.component(_VSpeedDial2.default.name, _VSpeedDial2.default);
};

exports.default = _VSpeedDial2.default;