'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VStepperItems = exports.VStepperHeader = exports.VStepperStep = exports.VStepperContent = exports.VStepper = undefined;

var _helpers = require('../../util/helpers');

var _VStepper = require('./VStepper');

var _VStepper2 = _interopRequireDefault(_VStepper);

var _VStepperStep = require('./VStepperStep');

var _VStepperStep2 = _interopRequireDefault(_VStepperStep);

var _VStepperContent = require('./VStepperContent');

var _VStepperContent2 = _interopRequireDefault(_VStepperContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VStepperHeader = (0, _helpers.createSimpleFunctional)('stepper__header');
var VStepperItems = (0, _helpers.createSimpleFunctional)('stepper__items');

exports.VStepper = _VStepper2.default;
exports.VStepperContent = _VStepperContent2.default;
exports.VStepperStep = _VStepperStep2.default;
exports.VStepperHeader = VStepperHeader;
exports.VStepperItems = VStepperItems;

/* istanbul ignore next */

_VStepper2.default.install = function install(Vue) {
  Vue.component(_VStepper2.default.name, _VStepper2.default);
  Vue.component(_VStepperContent2.default.name, _VStepperContent2.default);
  Vue.component(_VStepperStep2.default.name, _VStepperStep2.default);
  Vue.component(VStepperHeader.name, VStepperHeader);
  Vue.component(VStepperItems.name, VStepperItems);
};

exports.default = _VStepper2.default;