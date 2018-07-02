'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_bottom-navs.styl');

var _applicationable = require('../../mixins/applicationable');

var _applicationable2 = _interopRequireDefault(_applicationable);

var _buttonGroup = require('../../mixins/button-group');

var _buttonGroup2 = _interopRequireDefault(_buttonGroup);

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Styles
exports.default = {
  name: 'v-bottom-nav',

  mixins: [(0, _applicationable2.default)('bottom', ['height', 'value']), _buttonGroup2.default, _colorable2.default],

  props: {
    active: [Number, String],
    height: {
      default: 56,
      type: [Number, String],
      validator: function validator(v) {
        return !isNaN(parseInt(v));
      }
    },
    shift: Boolean,
    value: { required: false }
  },

  watch: {
    active: function active() {
      this.update();
    }
  },

  computed: {
    classes: function classes() {
      return {
        'bottom-nav--absolute': this.absolute,
        'bottom-nav--fixed': !this.absolute && (this.app || this.fixed),
        'bottom-nav--shift': this.shift,
        'bottom-nav--active': this.value
      };
    },
    computedHeight: function computedHeight() {
      return parseInt(this.height);
    }
  },

  methods: {
    isSelected: function isSelected(i) {
      var item = this.getValue(i);
      return this.active === item;
    },

    /**
     * Update the application layout
     *
     * @return {number}
     */
    updateApplication: function updateApplication() {
      return !this.value ? 0 : this.computedHeight;
    },
    updateValue: function updateValue(i) {
      var item = this.getValue(i);

      this.$emit('update:active', item);
    }
  },

  render: function render(h) {
    return h('div', {
      staticClass: 'bottom-nav',
      class: this.addBackgroundColorClassChecks(this.classes),
      style: {
        height: parseInt(this.computedHeight) + 'px'
      },
      ref: 'content'
    }, this.$slots.default);
  }
};

// Mixins