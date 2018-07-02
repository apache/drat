'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VForm = require('./VForm');

var _VForm2 = _interopRequireDefault(_VForm);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VForm2.default.install = function install(Vue) {
  Vue.component(_VForm2.default.name, _VForm2.default);
};

exports.default = _VForm2.default;