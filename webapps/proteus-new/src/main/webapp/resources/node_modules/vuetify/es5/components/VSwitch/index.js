'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VSwitch = require('./VSwitch');

var _VSwitch2 = _interopRequireDefault(_VSwitch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VSwitch2.default.install = function install(Vue) {
  Vue.component(_VSwitch2.default.name, _VSwitch2.default);
};

exports.default = _VSwitch2.default;