'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VAlert = require('./VAlert');

var _VAlert2 = _interopRequireDefault(_VAlert);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VAlert2.default.install = function install(Vue) {
  Vue.component(_VAlert2.default.name, _VAlert2.default);
};

exports.default = _VAlert2.default;