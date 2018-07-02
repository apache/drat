'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VBtnToggle = require('./VBtnToggle');

var _VBtnToggle2 = _interopRequireDefault(_VBtnToggle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VBtnToggle2.default.install = function install(Vue) {
  Vue.component(_VBtnToggle2.default.name, _VBtnToggle2.default);
};

exports.default = _VBtnToggle2.default;