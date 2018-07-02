'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = options;
var OPTIONS_DEFAULTS = {
  themeVariations: ['primary', 'secondary', 'accent'],
  minifyTheme: null,
  themeCache: null
};

function options() {
  var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

  return Object.assign({}, OPTIONS_DEFAULTS, options);
}