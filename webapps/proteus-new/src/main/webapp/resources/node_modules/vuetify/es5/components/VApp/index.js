'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VApp = require('./VApp');

var _VApp2 = _interopRequireDefault(_VApp);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VApp2.default.install = function install(Vue) {
  Vue.component(_VApp2.default.name, _VApp2.default);
};

exports.default = _VApp2.default;