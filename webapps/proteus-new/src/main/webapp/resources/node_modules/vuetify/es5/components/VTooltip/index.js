'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VTooltip = require('./VTooltip');

var _VTooltip2 = _interopRequireDefault(_VTooltip);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VTooltip2.default.install = function install(Vue) {
  Vue.component(_VTooltip2.default.name, _VTooltip2.default);
};

exports.default = _VTooltip2.default;