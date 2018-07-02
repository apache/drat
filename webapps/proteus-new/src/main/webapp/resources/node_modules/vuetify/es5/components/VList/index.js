'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VListTileSubTitle = exports.VListTileTitle = exports.VListTileContent = exports.VListTileActionText = exports.VListTileAvatar = exports.VListTileAction = exports.VListTile = exports.VListGroup = exports.VList = undefined;

var _helpers = require('../../util/helpers');

var _VList = require('./VList');

var _VList2 = _interopRequireDefault(_VList);

var _VListGroup = require('./VListGroup');

var _VListGroup2 = _interopRequireDefault(_VListGroup);

var _VListTile = require('./VListTile');

var _VListTile2 = _interopRequireDefault(_VListTile);

var _VListTileAction = require('./VListTileAction');

var _VListTileAction2 = _interopRequireDefault(_VListTileAction);

var _VListTileAvatar = require('./VListTileAvatar');

var _VListTileAvatar2 = _interopRequireDefault(_VListTileAvatar);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.VList = _VList2.default;
exports.VListGroup = _VListGroup2.default;
exports.VListTile = _VListTile2.default;
exports.VListTileAction = _VListTileAction2.default;
exports.VListTileAvatar = _VListTileAvatar2.default;
var VListTileActionText = exports.VListTileActionText = (0, _helpers.createSimpleFunctional)('list__tile__action-text', 'span');
var VListTileContent = exports.VListTileContent = (0, _helpers.createSimpleFunctional)('list__tile__content', 'div');
var VListTileTitle = exports.VListTileTitle = (0, _helpers.createSimpleFunctional)('list__tile__title', 'div');
var VListTileSubTitle = exports.VListTileSubTitle = (0, _helpers.createSimpleFunctional)('list__tile__sub-title', 'div');

/* istanbul ignore next */
_VList2.default.install = function install(Vue) {
  Vue.component(_VList2.default.name, _VList2.default);
  Vue.component(_VListGroup2.default.name, _VListGroup2.default);
  Vue.component(_VListTile2.default.name, _VListTile2.default);
  Vue.component(_VListTileAction2.default.name, _VListTileAction2.default);
  Vue.component(VListTileActionText.name, VListTileActionText);
  Vue.component(_VListTileAvatar2.default.name, _VListTileAvatar2.default);
  Vue.component(VListTileContent.name, VListTileContent);
  Vue.component(VListTileSubTitle.name, VListTileSubTitle);
  Vue.component(VListTileTitle.name, VListTileTitle);
};

exports.default = _VList2.default;