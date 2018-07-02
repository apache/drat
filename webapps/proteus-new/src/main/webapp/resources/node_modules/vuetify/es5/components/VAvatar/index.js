'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VAvatar = require('./VAvatar');

var _VAvatar2 = _interopRequireDefault(_VAvatar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VAvatar2.default.install = function install(Vue) {
  Vue.component(_VAvatar2.default.name, _VAvatar2.default);
};

exports.default = _VAvatar2.default;