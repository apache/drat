'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.genVariantColor = exports.genBaseColor = undefined;
exports.parse = parse;
exports.genVariations = genVariations;

var _colorUtils = require('./colorUtils');

var _transformSRGB = require('./color/transformSRGB');

var sRGB = _interopRequireWildcard(_transformSRGB);

var _transformCIELAB = require('./color/transformCIELAB');

var LAB = _interopRequireWildcard(_transformCIELAB);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 * @param {object} theme
 * @returns {object}
 */
function parse(theme) {
  var colors = Object.keys(theme);
  var parsedTheme = {};

  for (var i = 0; i < colors.length; ++i) {
    var name = colors[i];
    var value = theme[name];

    parsedTheme[name] = (0, _colorUtils.colorToInt)(value);
  }

  return parsedTheme;
}

function genVariations(name, value) {
  var values = Array(10);
  values[0] = genBaseColor(name, value);

  for (var i = 1, n = 5; i <= 5; ++i, --n) {
    values[i] = genVariantColor(name, lighten(value, n), 'lighten', n);
  }

  for (var _i = 1; _i <= 4; ++_i) {
    values[_i + 5] = genVariantColor(name, darken(value, _i), 'darken', _i);
  }

  return values;
}

function lighten(value, amount) {
  var lab = LAB.fromXYZ(sRGB.toXYZ(value));
  lab[0] = lab[0] + amount * 10;
  return sRGB.fromXYZ(LAB.toXYZ(lab));
}

function darken(value, amount) {
  var lab = LAB.fromXYZ(sRGB.toXYZ(value));
  lab[0] = lab[0] - amount * 10;
  return sRGB.fromXYZ(LAB.toXYZ(lab));
}

/**
 * Generate the CSS for a base color (.primary)
 *
 * @param {string} name - The color name
 * @param {string|number} value - The color value
 * @returns {string}
 */
var genBaseColor = exports.genBaseColor = function genBaseColor(name, value) {
  value = (0, _colorUtils.intToHex)(value);
  return '\n.' + name + ' {\n  background-color: ' + value + ' !important;\n  border-color: ' + value + ' !important;\n}\n.' + name + '--text {\n  color: ' + value + ' !important;\n}\n.' + name + '--text input,\n.' + name + '--text textarea {\n  caret-color: ' + value + ' !important;\n}\n.' + name + '--after::after {\n  background: ' + value + ' !important;\n}';
};

/**
 * Generate the CSS for a variant color (.primary.darken-2)
 *
 * @param {string} name - The color name
 * @param {string|number} value - The color value
 * @param {string} type - The variant type (darken/lighten)
 * @param {number} n - The darken/lighten step number
 * @returns {string}
 */
var genVariantColor = exports.genVariantColor = function genVariantColor(name, value, type, n) {
  value = (0, _colorUtils.intToHex)(value);
  return '\n.' + name + '.' + type + '-' + n + ' {\n  background-color: ' + value + ' !important;\n  border-color: ' + value + ' !important;\n}\n.' + name + '--text.text--' + type + '-' + n + ' {\n  color: ' + value + ' !important;\n}\n.' + name + '--text.text--' + type + '-' + n + ' input,\n.' + name + '--text.text--' + type + '-' + n + ' textarea {\n  caret-color: ' + value + ' !important;\n}\n.' + name + '.' + type + '-' + n + '--after::after {\n  background: ' + value + ' !important;\n}';
};