'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.factory = factory;

var _helpers = require('../util/helpers');

function factory() {
  var selected = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];

  var props = {
    absolute: Boolean,
    bottom: Boolean,
    fixed: Boolean,
    left: Boolean,
    right: Boolean,
    top: Boolean
  };

  return {
    name: 'positionable',
    props: selected.length ? (0, _helpers.filterObjectOnKeys)(props, selected) : props
  };
}

exports.default = factory();