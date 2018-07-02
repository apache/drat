'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VFooter = require('./VFooter');

var _VFooter2 = _interopRequireDefault(_VFooter);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VFooter2.default.install = function install(Vue) {
  Vue.component(_VFooter2.default.name, _VFooter2.default);
};

exports.default = _VFooter2.default;