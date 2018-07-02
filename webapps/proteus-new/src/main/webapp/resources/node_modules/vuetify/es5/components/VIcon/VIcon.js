'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

require('../../../src/stylus/components/_icons.styl');

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _helpers = require('../../util/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var SIZE_MAP = {
  small: '16px',
  default: '24px',
  medium: '28px',
  large: '36px',
  xLarge: '40px'
};

function isFontAwesome5(iconType) {
  return ['fas', 'far', 'fal', 'fab'].some(function (val) {
    return iconType.includes(val);
  });
}

exports.default = {
  name: 'v-icon',

  functional: true,

  mixins: [_colorable2.default, _themeable2.default],

  props: {
    disabled: Boolean,
    large: Boolean,
    left: Boolean,
    medium: Boolean,
    right: Boolean,
    size: {
      type: [Number, String]
    },
    small: Boolean,
    xLarge: Boolean
  },

  render: function render(h, _ref) {
    var props = _ref.props,
        data = _ref.data,
        _ref$children = _ref.children,
        children = _ref$children === undefined ? [] : _ref$children;
    var small = props.small,
        medium = props.medium,
        large = props.large,
        xLarge = props.xLarge;

    var sizes = { small: small, medium: medium, large: large, xLarge: xLarge };
    var explicitSize = Object.keys(sizes).find(function (key) {
      return sizes[key] && key;
    });
    var fontSize = explicitSize && SIZE_MAP[explicitSize] || (0, _helpers.convertToUnit)(props.size);

    if (fontSize) data.style = _extends({ fontSize: fontSize }, data.style);

    var iconName = '';
    if (children.length) iconName = children.pop().text;
    // Support usage of v-text and v-html
    else if (data.domProps) {
        iconName = data.domProps.textContent || data.domProps.innerHTML || iconName;

        // Remove nodes so it doesn't
        // overwrite our changes
        delete data.domProps.textContent;
        delete data.domProps.innerHTML;
      }

    var iconType = 'material-icons';
    // Material Icon delimiter is _
    // https://material.io/icons/
    var delimiterIndex = iconName.indexOf('-');
    var isCustomIcon = delimiterIndex > -1;

    if (isCustomIcon) {
      iconType = iconName.slice(0, delimiterIndex);

      if (isFontAwesome5(iconType)) iconType = '';
      // Assume if not a custom icon
      // is Material Icon font
    } else children.push(iconName);

    data.attrs = data.attrs || {};
    if (!('aria-hidden' in data.attrs)) {
      data.attrs['aria-hidden'] = true;
    }

    var classes = Object.assign({
      'icon--disabled': props.disabled,
      'icon--left': props.left,
      'icon--right': props.right,
      'theme--dark': props.dark,
      'theme--light': props.light
    }, props.color ? _colorable2.default.methods.addTextColorClassChecks.call(props, {}, props.color) : {});

    // Order classes
    // * Component class
    // * Vuetify classes
    // * Icon Classes
    data.staticClass = ['icon', data.staticClass, Object.keys(classes).filter(function (k) {
      return classes[k];
    }).join(' '), iconType, isCustomIcon ? iconName : null].reduce(function (prev, curr) {
      return curr ? prev + ' ' + curr : prev;
    }).trim();

    return h('i', data, children);
  }
};