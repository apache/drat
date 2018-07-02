'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VDialog = require('./VDialog');

var _VDialog2 = _interopRequireDefault(_VDialog);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VDialog2.default.install = function install(Vue) {
  Vue.component(_VDialog2.default.name, _VDialog2.default);
};

exports.default = _VDialog2.default;