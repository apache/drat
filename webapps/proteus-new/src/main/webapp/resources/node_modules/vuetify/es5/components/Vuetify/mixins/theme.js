'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = theme;
/* eslint-disable no-multi-spaces */
var THEME_DEFAULTS = {
  primary: '#1976D2', // blue.darken2
  secondary: '#424242', // grey.darken3
  accent: '#82B1FF', // blue.accent1
  error: '#FF5252', // red.accent2
  info: '#2196F3', // blue.base
  success: '#4CAF50', // green.base
  warning: '#FFC107' // amber.base
};

function theme() {
  var theme = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.assign({}, THEME_DEFAULTS, theme);
}