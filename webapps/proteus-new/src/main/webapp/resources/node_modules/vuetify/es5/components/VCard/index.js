'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VCardText = exports.VCardActions = exports.VCardTitle = exports.VCardMedia = exports.VCard = undefined;

var _helpers = require('../../util/helpers');

var _VCard = require('./VCard');

var _VCard2 = _interopRequireDefault(_VCard);

var _VCardMedia = require('./VCardMedia');

var _VCardMedia2 = _interopRequireDefault(_VCardMedia);

var _VCardTitle = require('./VCardTitle');

var _VCardTitle2 = _interopRequireDefault(_VCardTitle);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var VCardActions = (0, _helpers.createSimpleFunctional)('card__actions');
var VCardText = (0, _helpers.createSimpleFunctional)('card__text');

exports.VCard = _VCard2.default;
exports.VCardMedia = _VCardMedia2.default;
exports.VCardTitle = _VCardTitle2.default;
exports.VCardActions = VCardActions;
exports.VCardText = VCardText;

/* istanbul ignore next */

_VCard2.default.install = function install(Vue) {
  Vue.component(_VCard2.default.name, _VCard2.default);
  Vue.component(_VCardMedia2.default.name, _VCardMedia2.default);
  Vue.component(_VCardTitle2.default.name, _VCardTitle2.default);
  Vue.component(VCardActions.name, VCardActions);
  Vue.component(VCardText.name, VCardText);
};

exports.default = _VCard2.default;