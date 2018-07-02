'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VSnackbar = require('./VSnackbar');

var _VSnackbar2 = _interopRequireDefault(_VSnackbar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VSnackbar2.default.install = function install(Vue) {
  Vue.component(_VSnackbar2.default.name, _VSnackbar2.default);
};

exports.default = _VSnackbar2.default;