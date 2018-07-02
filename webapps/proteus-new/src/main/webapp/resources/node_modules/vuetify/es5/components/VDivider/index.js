'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VDivider = require('./VDivider');

var _VDivider2 = _interopRequireDefault(_VDivider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VDivider2.default.install = function install(Vue) {
  Vue.component(_VDivider2.default.name, _VDivider2.default);
};

exports.default = _VDivider2.default;