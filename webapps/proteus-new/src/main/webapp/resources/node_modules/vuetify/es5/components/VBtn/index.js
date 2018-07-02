'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VBtn = require('./VBtn');

var _VBtn2 = _interopRequireDefault(_VBtn);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VBtn2.default.install = function install(Vue) {
  Vue.component(_VBtn2.default.name, _VBtn2.default);
};

exports.default = _VBtn2.default;