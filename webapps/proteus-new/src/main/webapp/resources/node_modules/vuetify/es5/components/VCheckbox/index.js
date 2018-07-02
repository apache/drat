'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VCheckbox = require('./VCheckbox');

var _VCheckbox2 = _interopRequireDefault(_VCheckbox);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VCheckbox2.default.install = function install(Vue) {
  Vue.component(_VCheckbox2.default.name, _VCheckbox2.default);
};

exports.default = _VCheckbox2.default;