'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.colorToInt = colorToInt;
exports.intToHex = intToHex;

var _console = require('./console');

/**
 * @param {string|number} color
 * @returns {number}
 */
function colorToInt(color) {
  var rgb = void 0;

  if (typeof color === 'number') {
    rgb = color;
  } else if (typeof color === 'string') {
    var c = color[0] === '#' ? color.substring(1) : color;
    if (c.length === 3) {
      c = c.split('').map(function (char) {
        return char + char;
      }).join('');
    }
    if (c.length !== 6) {
      (0, _console.consoleWarn)('\'' + color + '\' is not a valid rgb color');
    }
    rgb = parseInt(c, 16);
  } else {
    throw new TypeError('Colors can only be numbers or strings, recieved ' + color.constructor.name + ' instead');
  }

  if (rgb < 0) {
    (0, _console.consoleWarn)('Colors cannot be negative: \'' + color + '\'');
    rgb = 0;
  } else if (rgb > 0xffffff || isNaN(rgb)) {
    (0, _console.consoleWarn)('\'' + color + '\' is not a valid rgb color');
    rgb = 0xffffff;
  }

  return rgb;
}

/**
 * @param {number} color
 * @returns {string}
 */
function intToHex(color) {
  color = color.toString(16);

  if (color.length < 6) color = '0'.repeat(6 - color.length) + color;

  return '#' + color;
}