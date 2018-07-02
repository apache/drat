'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VToolbarItems = exports.VToolbarTitle = exports.VToolbarSideIcon = exports.VToolbar = undefined;

var _helpers = require('../../util/helpers');

var _VToolbar = require('./VToolbar');

var _VToolbar2 = _interopRequireDefault(_VToolbar);

var _VToolbarSideIcon = require('./VToolbarSideIcon');

var _VToolbarSideIcon2 = _interopRequireDefault(_VToolbarSideIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VToolbarTitle = (0, _helpers.createSimpleFunctional)('toolbar__title');
var VToolbarItems = (0, _helpers.createSimpleFunctional)('toolbar__items');

exports.VToolbar = _VToolbar2.default;
exports.VToolbarSideIcon = _VToolbarSideIcon2.default;
exports.VToolbarTitle = VToolbarTitle;
exports.VToolbarItems = VToolbarItems;

/* istanbul ignore next */

_VToolbar2.default.install = function install(Vue) {
  Vue.component(_VToolbar2.default.name, _VToolbar2.default);
  Vue.component(VToolbarItems.name, VToolbarItems);
  Vue.component(VToolbarTitle.name, VToolbarTitle);
  Vue.component(_VToolbarSideIcon2.default.name, _VToolbarSideIcon2.default);
};

exports.default = _VToolbar2.default;