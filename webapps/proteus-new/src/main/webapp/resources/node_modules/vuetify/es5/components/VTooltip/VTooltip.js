'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_tooltips.styl');

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _delayable = require('../../mixins/delayable');

var _delayable2 = _interopRequireDefault(_delayable);

var _dependent = require('../../mixins/dependent');

var _dependent2 = _interopRequireDefault(_dependent);

var _detachable = require('../../mixins/detachable');

var _detachable2 = _interopRequireDefault(_detachable);

var _menuable = require('../../mixins/menuable');

var _menuable2 = _interopRequireDefault(_menuable);

var _toggleable = require('../../mixins/toggleable');

var _toggleable2 = _interopRequireDefault(_toggleable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// Mixins


exports.default = {
  name: 'v-tooltip',

  mixins: [_colorable2.default, _delayable2.default, _dependent2.default, _detachable2.default, _menuable2.default, _toggleable2.default],

  data: function data() {
    return {
      calculatedMinWidth: 0,
      closeDependents: false
    };
  },

  props: {
    debounce: {
      type: [Number, String],
      default: 0
    },
    disabled: Boolean,
    fixed: {
      type: Boolean,
      default: true
    },
    openDelay: {
      type: [Number, String],
      default: 200
    },
    tag: {
      type: String,
      default: 'span'
    },
    transition: String,
    zIndex: {
      default: null
    }
  },

  computed: {
    calculatedLeft: function calculatedLeft() {
      var _dimensions = this.dimensions,
          activator = _dimensions.activator,
          content = _dimensions.content;

      var unknown = !this.bottom && !this.left && !this.top && !this.right;
      var left = 0;

      if (this.top || this.bottom || unknown) {
        left = activator.left + activator.width / 2 - content.width / 2;
      } else if (this.left || this.right) {
        left = activator.left + (this.right ? activator.width : -content.width) + (this.right ? 10 : -10);
      }

      return this.calcXOverflow(left) + 'px';
    },
    calculatedTop: function calculatedTop() {
      var _dimensions2 = this.dimensions,
          activator = _dimensions2.activator,
          content = _dimensions2.content;

      var top = 0;

      if (this.top || this.bottom) {
        top = activator.top + (this.bottom ? activator.height : -content.height) + (this.bottom ? 10 : -10);
      } else if (this.left || this.right) {
        top = activator.top + activator.height / 2 - content.height / 2;
      }

      return this.calcYOverflow(top + this.pageYOffset) + 'px';
    },
    classes: function classes() {
      return {
        'tooltip--top': this.top,
        'tooltip--right': this.right,
        'tooltip--bottom': this.bottom,
        'tooltip--left': this.left
      };
    },
    computedTransition: function computedTransition() {
      if (this.transition) return this.transition;
      if (this.top) return 'slide-y-reverse-transition';
      if (this.right) return 'slide-x-transition';
      if (this.bottom) return 'slide-y-transition';
      if (this.left) return 'slide-x-reverse-transition';
    },
    offsetY: function offsetY() {
      return this.top || this.bottom;
    },
    offsetX: function offsetX() {
      return this.left || this.right;
    },
    styles: function styles() {
      return {
        left: this.calculatedLeft,
        maxWidth: isNaN(this.maxWidth) ? this.maxWidth : this.maxWidth + 'px',
        opacity: this.isActive ? 0.9 : 0,
        top: this.calculatedTop,
        zIndex: this.zIndex || this.activeZIndex
      };
    }
  },

  methods: {
    activate: function activate() {
      // Update coordinates and dimensions of menu
      // and its activator
      this.updateDimensions();
      // Start the transition
      requestAnimationFrame(this.startTransition);
    }
  },

  mounted: function mounted() {
    this.value && this.callActivate();
  },
  render: function render(h) {
    var _addBackgroundColorCl,
        _this = this;

    var tooltip = h('div', {
      staticClass: 'tooltip__content',
      'class': this.addBackgroundColorClassChecks((_addBackgroundColorCl = {}, _defineProperty(_addBackgroundColorCl, this.contentClass, true), _defineProperty(_addBackgroundColorCl, 'menuable__content__active', this.isActive), _addBackgroundColorCl)),
      style: this.styles,
      attrs: this.attrs,
      directives: [{
        name: 'show',
        value: this.isContentActive
      }],
      ref: 'content'
    }, this.$slots.default);

    return h(this.tag, {
      staticClass: 'tooltip',
      'class': this.classes
    }, [h('transition', {
      props: {
        name: this.computedTransition
      }
    }, [tooltip]), h('span', {
      on: this.disabled ? {} : {
        mouseenter: function mouseenter() {
          _this.runDelay('open', function () {
            return _this.isActive = true;
          });
        },
        mouseleave: function mouseleave() {
          _this.runDelay('close', function () {
            return _this.isActive = false;
          });
        }
      },
      ref: 'activator'
    }, this.$slots.activator)]);
  }
};