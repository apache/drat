'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VDataIterator = require('./VDataIterator');

var _VDataIterator2 = _interopRequireDefault(_VDataIterator);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

_VDataIterator2.default.install = function install(Vue) {
  Vue.component(_VDataIterator2.default.name, _VDataIterator2.default);
};

exports.default = _VDataIterator2.default;