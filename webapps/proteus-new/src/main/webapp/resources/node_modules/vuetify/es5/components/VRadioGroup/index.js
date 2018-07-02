'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VRadio = exports.VRadioGroup = undefined;

var _VRadioGroup = require('./VRadioGroup');

var _VRadioGroup2 = _interopRequireDefault(_VRadioGroup);

var _VRadio = require('./VRadio');

var _VRadio2 = _interopRequireDefault(_VRadio);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.VRadioGroup = _VRadioGroup2.default;
exports.VRadio = _VRadio2.default;

/* istanbul ignore next */

_VRadioGroup2.default.install = function install(Vue) {
  Vue.component(_VRadioGroup2.default.name, _VRadioGroup2.default);
  Vue.component(_VRadio2.default.name, _VRadio2.default);
};

exports.default = _VRadioGroup2.default;