'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VChip = require('./VChip');

var _VChip2 = _interopRequireDefault(_VChip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VChip2.default.install = function install(Vue) {
  Vue.component(_VChip2.default.name, _VChip2.default);
};

exports.default = _VChip2.default;