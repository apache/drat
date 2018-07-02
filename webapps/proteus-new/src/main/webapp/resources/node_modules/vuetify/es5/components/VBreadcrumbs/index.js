'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VBreadcrumbsItem = exports.VBreadcrumbs = undefined;

var _VBreadcrumbs = require('./VBreadcrumbs');

var _VBreadcrumbs2 = _interopRequireDefault(_VBreadcrumbs);

var _VBreadcrumbsItem = require('./VBreadcrumbsItem');

var _VBreadcrumbsItem2 = _interopRequireDefault(_VBreadcrumbsItem);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.VBreadcrumbs = _VBreadcrumbs2.default;
exports.VBreadcrumbsItem = _VBreadcrumbsItem2.default;

/* istanbul ignore next */

_VBreadcrumbs2.default.install = function install(Vue) {
  Vue.component(_VBreadcrumbs2.default.name, _VBreadcrumbs2.default);
  Vue.component(_VBreadcrumbsItem2.default.name, _VBreadcrumbsItem2.default);
};

exports.default = _VBreadcrumbs2.default;