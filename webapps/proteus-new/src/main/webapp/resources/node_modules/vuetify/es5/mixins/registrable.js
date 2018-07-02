'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.inject = inject;
exports.provide = provide;

var _console = require('../util/console');

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function generateWarning(child, parent) {
  return function () {
    return (0, _console.consoleWarn)('The ' + child + ' component must be used inside a ' + parent);
  };
}

function inject(namespace, child, parent) {
  var defaultImpl = child && parent ? {
    register: generateWarning(child, parent),
    unregister: generateWarning(child, parent)
  } : null;

  return {
    name: 'registrable-inject',

    inject: _defineProperty({}, namespace, {
      default: defaultImpl
    })
  };
}

function provide(namespace) {
  return {
    name: 'registrable-provide',

    methods: {
      register: null,
      unregister: null
    },
    provide: function provide() {
      return _defineProperty({}, namespace, {
        register: this.register,
        unregister: this.unregister
      });
    }
  };
}