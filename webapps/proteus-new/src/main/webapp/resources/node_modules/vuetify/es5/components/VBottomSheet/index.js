'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VBottomSheet = require('./VBottomSheet');

var _VBottomSheet2 = _interopRequireDefault(_VBottomSheet);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VBottomSheet2.default.install = function install(Vue) {
  Vue.component(_VBottomSheet2.default.name, _VBottomSheet2.default);
};

exports.default = _VBottomSheet2.default;