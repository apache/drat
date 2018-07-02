'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VSpacer = exports.VLayout = exports.VFlex = exports.VContent = exports.VContainer = undefined;

var _helpers = require('../../util/helpers');

var _VContent = require('./VContent');

var _VContent2 = _interopRequireDefault(_VContent);

var _VContainer = require('./VContainer');

var _VContainer2 = _interopRequireDefault(_VContainer);

var _VFlex = require('./VFlex');

var _VFlex2 = _interopRequireDefault(_VFlex);

var _VLayout = require('./VLayout');

var _VLayout2 = _interopRequireDefault(_VLayout);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VSpacer = (0, _helpers.createSimpleFunctional)('spacer');

exports.VContainer = _VContainer2.default;
exports.VContent = _VContent2.default;
exports.VFlex = _VFlex2.default;
exports.VLayout = _VLayout2.default;
exports.VSpacer = VSpacer;


var VGrid = {};

/* istanbul ignore next */
VGrid.install = function install(Vue) {
  Vue.component(_VContent2.default.name, _VContent2.default);
  Vue.component(_VContainer2.default.name, _VContainer2.default);
  Vue.component(_VFlex2.default.name, _VFlex2.default);
  Vue.component(_VLayout2.default.name, _VLayout2.default);
  Vue.component(VSpacer.name, VSpacer);
};

exports.default = VGrid;