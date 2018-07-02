'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VSelect = require('./VSelect');

var _VSelect2 = _interopRequireDefault(_VSelect);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VSelect2.default.install = function install(Vue) {
  Vue.component(_VSelect2.default.name, _VSelect2.default);
};

exports.default = _VSelect2.default;