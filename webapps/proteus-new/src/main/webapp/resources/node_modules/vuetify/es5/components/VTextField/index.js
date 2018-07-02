'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VTextField = require('./VTextField');

var _VTextField2 = _interopRequireDefault(_VTextField);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VTextField2.default.install = function install(Vue) {
  Vue.component(_VTextField2.default.name, _VTextField2.default);
};

exports.default = _VTextField2.default;