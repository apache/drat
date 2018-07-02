'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // Styles


// Components


// Mixins


require('../../../src/stylus/components/_buttons.styl');

var _VProgressCircular = require('../VProgressCircular');

var _VProgressCircular2 = _interopRequireDefault(_VProgressCircular);

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _positionable = require('../../mixins/positionable');

var _positionable2 = _interopRequireDefault(_positionable);

var _routable = require('../../mixins/routable');

var _routable2 = _interopRequireDefault(_routable);

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

var _toggleable = require('../../mixins/toggleable');

var _registrable = require('../../mixins/registrable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = {
  name: 'v-btn',

  mixins: [_colorable2.default, _routable2.default, _positionable2.default, _themeable2.default, (0, _toggleable.factory)('inputValue'), (0, _registrable.inject)('buttonGroup')],

  props: {
    activeClass: {
      type: String,
      default: 'btn--active'
    },
    block: Boolean,
    depressed: Boolean,
    fab: Boolean,
    flat: Boolean,
    icon: Boolean,
    large: Boolean,
    loading: Boolean,
    outline: Boolean,
    ripple: {
      type: [Boolean, Object],
      default: true
    },
    round: Boolean,
    small: Boolean,
    tag: {
      type: String,
      default: 'button'
    },
    type: {
      type: String,
      default: 'button'
    },
    value: null
  },

  computed: {
    classes: function classes() {
      var _extends2;

      var classes = _extends((_extends2 = {
        'btn': true
      }, _defineProperty(_extends2, this.activeClass, this.isActive), _defineProperty(_extends2, 'btn--absolute', this.absolute), _defineProperty(_extends2, 'btn--block', this.block), _defineProperty(_extends2, 'btn--bottom', this.bottom), _defineProperty(_extends2, 'btn--disabled', this.disabled), _defineProperty(_extends2, 'btn--flat', this.flat), _defineProperty(_extends2, 'btn--floating', this.fab), _defineProperty(_extends2, 'btn--fixed', this.fixed), _defineProperty(_extends2, 'btn--hover', this.hover), _defineProperty(_extends2, 'btn--icon', this.icon), _defineProperty(_extends2, 'btn--large', this.large), _defineProperty(_extends2, 'btn--left', this.left), _defineProperty(_extends2, 'btn--loader', this.loading), _defineProperty(_extends2, 'btn--outline', this.outline), _defineProperty(_extends2, 'btn--depressed', this.depressed && !this.flat || this.outline), _defineProperty(_extends2, 'btn--right', this.right), _defineProperty(_extends2, 'btn--round', this.round), _defineProperty(_extends2, 'btn--router', this.to), _defineProperty(_extends2, 'btn--small', this.small), _defineProperty(_extends2, 'btn--top', this.top), _extends2), this.themeClasses);

      return !this.outline && !this.flat ? this.addBackgroundColorClassChecks(classes) : this.addTextColorClassChecks(classes);
    }
  },

  methods: {
    // Prevent focus to match md spec
    click: function click(e) {
      !this.fab && e.detail && this.$el.blur();

      this.$emit('click', e);
    },
    genContent: function genContent() {
      return this.$createElement('div', { 'class': 'btn__content' }, [this.$slots.default]);
    },
    genLoader: function genLoader() {
      var children = [];

      if (!this.$slots.loader) {
        children.push(this.$createElement(_VProgressCircular2.default, {
          props: {
            indeterminate: true,
            size: 23,
            width: 2
          }
        }));
      } else {
        children.push(this.$slots.loader);
      }

      return this.$createElement('span', { 'class': 'btn__loading' }, children);
    }
  },

  mounted: function mounted() {
    if (this.buttonGroup) {
      this.buttonGroup.register(this);
    }
  },
  beforeDestroy: function beforeDestroy() {
    if (this.buttonGroup) {
      this.buttonGroup.unregister(this);
    }
  },
  render: function render(h) {
    var _generateRouteLink = this.generateRouteLink(),
        tag = _generateRouteLink.tag,
        data = _generateRouteLink.data;

    var children = [this.genContent()];

    tag === 'button' && (data.attrs.type = this.type);
    this.loading && children.push(this.genLoader());

    data.attrs.value = ['string', 'number'].includes(_typeof(this.value)) ? this.value : JSON.stringify(this.value);

    return h(tag, data, children);
  }
};