'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VNavigationDrawer = require('./VNavigationDrawer');

var _VNavigationDrawer2 = _interopRequireDefault(_VNavigationDrawer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* istanbul ignore next */
_VNavigationDrawer2.default.install = function install(Vue) {
  Vue.component(_VNavigationDrawer2.default.name, _VNavigationDrawer2.default);
};

exports.default = _VNavigationDrawer2.default;