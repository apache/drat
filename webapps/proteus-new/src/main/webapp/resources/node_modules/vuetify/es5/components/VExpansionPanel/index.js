'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VExpansionPanelContent = exports.VExpansionPanel = undefined;

var _VExpansionPanel = require('./VExpansionPanel');

var _VExpansionPanel2 = _interopRequireDefault(_VExpansionPanel);

var _VExpansionPanelContent = require('./VExpansionPanelContent');

var _VExpansionPanelContent2 = _interopRequireDefault(_VExpansionPanelContent);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.VExpansionPanel = _VExpansionPanel2.default;
exports.VExpansionPanelContent = _VExpansionPanelContent2.default;

/* istanbul ignore next */

_VExpansionPanel2.default.install = function install(Vue) {
  Vue.component(_VExpansionPanel2.default.name, _VExpansionPanel2.default);
  Vue.component(_VExpansionPanelContent2.default.name, _VExpansionPanelContent2.default);
};

exports.default = _VExpansionPanel2.default;