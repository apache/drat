'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VTabsSlider = exports.VTabsItems = exports.VTab = exports.VTabItem = exports.VTabs = undefined;

var _VTabs = require('./VTabs');

var _VTabs2 = _interopRequireDefault(_VTabs);

var _VTab = require('./VTab');

var _VTab2 = _interopRequireDefault(_VTab);

var _VTabsItems = require('./VTabsItems');

var _VTabsItems2 = _interopRequireDefault(_VTabsItems);

var _VTabItem = require('./VTabItem');

var _VTabItem2 = _interopRequireDefault(_VTabItem);

var _VTabsSlider = require('./VTabsSlider');

var _VTabsSlider2 = _interopRequireDefault(_VTabsSlider);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.VTabs = _VTabs2.default;
exports.VTabItem = _VTabItem2.default;
exports.VTab = _VTab2.default;
exports.VTabsItems = _VTabsItems2.default;
exports.VTabsSlider = _VTabsSlider2.default;

/* istanbul ignore next */

_VTabs2.default.install = function install(Vue) {
  Vue.component(_VTabs2.default.name, _VTabs2.default);
  Vue.component(_VTab2.default.name, _VTab2.default);
  Vue.component(_VTabsItems2.default.name, _VTabsItems2.default);
  Vue.component(_VTabItem2.default.name, _VTabItem2.default);
  Vue.component(_VTabsSlider2.default.name, _VTabsSlider2.default);
};

exports.default = _VTabs2.default;