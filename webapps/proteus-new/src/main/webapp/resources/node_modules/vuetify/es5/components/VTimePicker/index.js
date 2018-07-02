'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VTimePickerTitle = exports.VTimePickerClock = exports.VTimePicker = undefined;

var _VTimePicker = require('./VTimePicker');

var _VTimePicker2 = _interopRequireDefault(_VTimePicker);

var _VTimePickerClock = require('./VTimePickerClock');

var _VTimePickerClock2 = _interopRequireDefault(_VTimePickerClock);

var _VTimePickerTitle = require('./VTimePickerTitle');

var _VTimePickerTitle2 = _interopRequireDefault(_VTimePickerTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.VTimePicker = _VTimePicker2.default;
exports.VTimePickerClock = _VTimePickerClock2.default;
exports.VTimePickerTitle = _VTimePickerTitle2.default;

/* istanbul ignore next */

_VTimePicker2.default.install = function install(Vue) {
  Vue.component(_VTimePicker2.default.name, _VTimePicker2.default);
  Vue.component(_VTimePickerClock2.default.name, _VTimePickerClock2.default);
  Vue.component(_VTimePickerTitle2.default.name, _VTimePickerTitle2.default);
};

exports.default = _VTimePicker2.default;