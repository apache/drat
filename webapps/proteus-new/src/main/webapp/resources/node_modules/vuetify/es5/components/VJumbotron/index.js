'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VJumbotron = require('./VJumbotron');

var _VJumbotron2 = _interopRequireDefault(_VJumbotron);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VJumbotron2.default.install = function install(Vue) {
  Vue.component(_VJumbotron2.default.name, _VJumbotron2.default);
};

exports.default = _VJumbotron2.default;