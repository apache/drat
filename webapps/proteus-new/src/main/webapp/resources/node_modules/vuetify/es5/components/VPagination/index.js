'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VPagination = require('./VPagination');

var _VPagination2 = _interopRequireDefault(_VPagination);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VPagination2.default.install = function install(Vue) {
  Vue.component(_VPagination2.default.name, _VPagination2.default);
};

exports.default = _VPagination2.default;