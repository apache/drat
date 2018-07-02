'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

exports.createSimpleFunctional = createSimpleFunctional;
exports.createSimpleTransition = createSimpleTransition;
exports.createJavaScriptTransition = createJavaScriptTransition;
exports.directiveConfig = directiveConfig;
exports.addOnceEventListener = addOnceEventListener;
exports.getObjectValueByPath = getObjectValueByPath;
exports.createRange = createRange;
exports.getZIndex = getZIndex;
exports.escapeHTML = escapeHTML;
exports.filterObjectOnKeys = filterObjectOnKeys;
exports.filterChildren = filterChildren;
exports.convertToUnit = convertToUnit;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function createSimpleFunctional(c) {
  var el = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'div';
  var name = arguments[2];

  name = name || c.replace(/__/g, '-');

  return {
    name: 'v-' + name,
    functional: true,

    render: function render(h, _ref) {
      var data = _ref.data,
          children = _ref.children;

      data.staticClass = (c + ' ' + (data.staticClass || '')).trim();

      return h(el, data, children);
    }
  };
}

function createSimpleTransition(name) {
  var origin = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top center 0';
  var mode = arguments[2];

  return {
    name: name,

    functional: true,

    props: {
      origin: {
        type: String,
        default: origin
      }
    },

    render: function render(h, context) {
      context.data = context.data || {};
      context.data.props = { name: name };
      context.data.on = context.data.on || {};
      if (!Object.isExtensible(context.data.on)) {
        context.data.on = _extends({}, context.data.on);
      }

      if (mode) context.data.props.mode = mode;

      context.data.on.beforeEnter = function (el) {
        el.style.transformOrigin = context.props.origin;
        el.style.webkitTransformOrigin = context.props.origin;
      };

      return h('transition', context.data, context.children);
    }
  };
}

function createJavaScriptTransition(name, functions) {
  var css = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;
  var mode = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'in-out';

  return {
    name: name,

    functional: true,

    props: {
      css: {
        type: Boolean,
        default: css
      },
      mode: {
        type: String,
        default: mode
      }
    },

    render: function render(h, context) {
      var data = {
        props: _extends({}, context.props, {
          name: name
        }),
        on: functions
      };

      return h('transition', data, context.children);
    }
  };
}

function directiveConfig(binding) {
  var defaults = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

  return Object.assign({}, defaults, binding.modifiers, { value: binding.arg }, binding.value || {});
}

function addOnceEventListener(el, event, cb) {
  var once = function once() {
    cb();
    el.removeEventListener(event, once, false);
  };

  el.addEventListener(event, once, false);
}

function getObjectValueByPath(obj, path) {
  // credit: http://stackoverflow.com/questions/6491463/accessing-nested-javascript-objects-with-string-key#comment55278413_6491621
  if (!path || path.constructor !== String) return;
  path = path.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
  path = path.replace(/^\./, ''); // strip a leading dot
  var a = path.split('.');
  for (var i = 0, n = a.length; i < n; ++i) {
    var k = a[i];
    if (obj instanceof Object && k in obj) {
      obj = obj[k];
    } else {
      return;
    }
  }
  return obj;
}

function createRange(length) {
  return [].concat(_toConsumableArray(Array.from({ length: length }, function (v, k) {
    return k;
  })));
}

function getZIndex(el) {
  if (!el || el.nodeType !== Node.ELEMENT_NODE) return 0;

  var index = window.getComputedStyle(el).getPropertyValue('z-index');

  if (isNaN(index)) return getZIndex(el.parentNode);
  return index;
}

var tagsToReplace = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;'
};

function escapeHTML(str) {
  return str.replace(/[&<>]/g, function (tag) {
    return tagsToReplace[tag] || tag;
  });
}

function filterObjectOnKeys(obj, keys) {
  var filtered = {};

  for (var i = 0; i < keys.length; i++) {
    var key = keys[i];
    if (typeof obj[key] !== 'undefined') {
      filtered[key] = obj[key];
    }
  }

  return filtered;
}

function filterChildren() {
  var array = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
  var tag = arguments[1];

  return array.filter(function (child) {
    return child.componentOptions && child.componentOptions.Ctor.options.name === tag;
  });
}

function convertToUnit(str) {
  var unit = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'px';

  return isNaN(str) ? str : '' + Number(str) + unit;
}