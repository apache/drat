'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VBadge = require('./VBadge');

var _VBadge2 = _interopRequireDefault(_VBadge);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VBadge2.default.install = function install(Vue) {
  Vue.component(_VBadge2.default.name, _VBadge2.default);
};

exports.default = _VBadge2.default;