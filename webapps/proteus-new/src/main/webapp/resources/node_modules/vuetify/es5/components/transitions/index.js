'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VRowExpandTransition = exports.VExpandTransition = exports.VSlideYReverseTransition = exports.VSlideYTransition = exports.VSlideXReverseTransition = exports.VSlideXTransition = exports.VScaleTransition = exports.VFadeTransition = exports.VDialogBottomTransition = exports.VDialogTransition = exports.VFabTransition = exports.VMenuTransition = exports.VTabReverseTransition = exports.VTabTransition = exports.VCarouselReverseTransition = exports.VCarouselTransition = exports.VBottomSheetTranstion = undefined;

var _helpers = require('../../util/helpers');

var _expandTransition = require('./expand-transition');

var _expandTransition2 = _interopRequireDefault(_expandTransition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Component specific transitions
var VBottomSheetTranstion = exports.VBottomSheetTranstion = (0, _helpers.createSimpleTransition)('bottom-sheet-transition');
var VCarouselTransition = exports.VCarouselTransition = (0, _helpers.createSimpleTransition)('carousel-transition');
var VCarouselReverseTransition = exports.VCarouselReverseTransition = (0, _helpers.createSimpleTransition)('carousel-reverse-transition');
var VTabTransition = exports.VTabTransition = (0, _helpers.createSimpleTransition)('tab-transition');
var VTabReverseTransition = exports.VTabReverseTransition = (0, _helpers.createSimpleTransition)('tab-reverse-transition');
var VMenuTransition = exports.VMenuTransition = (0, _helpers.createSimpleTransition)('menu-transition');
var VFabTransition = exports.VFabTransition = (0, _helpers.createSimpleTransition)('fab-transition', 'center center', 'out-in');

// Generic transitions
var VDialogTransition = exports.VDialogTransition = (0, _helpers.createSimpleTransition)('dialog-transition');
var VDialogBottomTransition = exports.VDialogBottomTransition = (0, _helpers.createSimpleTransition)('dialog-bottom-transition');
var VFadeTransition = exports.VFadeTransition = (0, _helpers.createSimpleTransition)('fade-transition');
var VScaleTransition = exports.VScaleTransition = (0, _helpers.createSimpleTransition)('scale-transition');
var VSlideXTransition = exports.VSlideXTransition = (0, _helpers.createSimpleTransition)('slide-x-transition');
var VSlideXReverseTransition = exports.VSlideXReverseTransition = (0, _helpers.createSimpleTransition)('slide-x-reverse-transition');
var VSlideYTransition = exports.VSlideYTransition = (0, _helpers.createSimpleTransition)('slide-y-transition');
var VSlideYReverseTransition = exports.VSlideYReverseTransition = (0, _helpers.createSimpleTransition)('slide-y-reverse-transition');

// JavaScript transitions
var VExpandTransition = exports.VExpandTransition = (0, _helpers.createJavaScriptTransition)('expand-transition', (0, _expandTransition2.default)());
var VRowExpandTransition = exports.VRowExpandTransition = (0, _helpers.createJavaScriptTransition)('row-expand-transition', (0, _expandTransition2.default)('datatable__expand-col--expanded'));

exports.default = install;
/* istanbul ignore next */

function install(Vue) {
  Vue.component('v-bottom-sheet-transition', VBottomSheetTranstion);
  Vue.component('v-carousel-transition', VCarouselTransition);
  Vue.component('v-carousel-reverse-transition', VCarouselReverseTransition);
  Vue.component('v-dialog-transition', VDialogTransition);
  Vue.component('v-dialog-bottom-transition', VDialogBottomTransition);
  Vue.component('v-fab-transition', VFabTransition);
  Vue.component('v-fade-transition', VFadeTransition);
  Vue.component('v-menu-transition', VMenuTransition);
  Vue.component('v-scale-transition', VScaleTransition);
  Vue.component('v-slide-x-transition', VSlideXTransition);
  Vue.component('v-slide-x-reverse-transition', VSlideXReverseTransition);
  Vue.component('v-slide-y-transition', VSlideYTransition);
  Vue.component('v-slide-y-reverse-transition', VSlideYReverseTransition);
  Vue.component('v-tab-reverse-transition', VTabReverseTransition);
  Vue.component('v-tab-transition', VTabTransition);
  Vue.component('v-expand-transition', VExpandTransition);
  Vue.component('v-row-expand-transition', VRowExpandTransition);
}