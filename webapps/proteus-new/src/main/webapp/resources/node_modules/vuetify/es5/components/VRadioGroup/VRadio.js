'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; // Components


// Mixins


var _transitions = require('../transitions');

var _VIcon = require('../VIcon');

var _VIcon2 = _interopRequireDefault(_VIcon);

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _rippleable = require('../../mixins/rippleable');

var _rippleable2 = _interopRequireDefault(_rippleable);

var _tabFocusable = require('../../mixins/tab-focusable');

var _tabFocusable2 = _interopRequireDefault(_tabFocusable);

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

var _registrable = require('../../mixins/registrable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-radio',

  inheritAttrs: false,

  inject: ['isMandatory', 'name'],

  mixins: [_colorable2.default, _rippleable2.default, (0, _registrable.inject)('radio', 'v-radio', 'v-radio-group'), _tabFocusable2.default, _themeable2.default],

  data: function data() {
    return {
      defaultColor: 'accent',
      isActive: false,
      parentError: false
    };
  },

  props: {
    disabled: Boolean,
    value: null,
    label: String
  },

  computed: {
    classes: function classes() {
      var classes = {
        'input-group': true,
        'input-group--active': this.isActive,
        'input-group--disabled': this.disabled,
        'input-group--selection-controls': true,
        'input-group--tab-focused': this.tabFocused,
        'radio': true,
        'theme--dark': this.dark,
        'theme--light': this.light
      };

      if (!this.parentError) {
        return this.addTextColorClassChecks(classes);
      }

      return classes;
    },
    icon: function icon() {
      return this.isActive ? 'radio_button_checked' : 'radio_button_unchecked';
    }
  },

  methods: {
    genInput: function genInput(radio) {
      var value = ['string', 'number'].includes(_typeof(this.value)) ? this.value : JSON.stringify(this.value);
      var input = this.$createElement('input', {
        ref: 'input',
        style: {
          display: 'none'
        },
        attrs: Object.assign({
          name: this.name && this.name(),
          id: this.id,
          type: 'radio',
          value: value
        }, this.$attrs)
      }, [value]);

      radio.push(input);

      return this.$createElement('div', {
        class: 'input-group__input'
      }, radio);
    },
    genWrapper: function genWrapper(radio) {
      var _this = this;

      var children = [];

      children.push(this.genLabel());
      children.push(this.genInput(radio));

      return this.$createElement('div', {
        class: this.classes,
        attrs: {
          role: 'radio',
          'aria-checked': this.isActive ? 'true' : 'false',
          'aria-label': this.label
        },
        on: {
          keydown: function keydown(e) {
            if ([13, 32].includes(e.keyCode)) {
              e.preventDefault();
              _this.toggle();
            }
          },
          blur: function blur(e) {
            _this.$emit('blur', e);
            _this.tabFocused = false;
          }
        }
      }, children);
    },
    genLabel: function genLabel() {
      return this.$createElement('label', {
        on: {
          click: this.toggle
        }
      }, this.$slots.label || this.label);
    },
    toggle: function toggle() {
      var mandatory = !!this.isMandatory && this.isMandatory();

      if (!this.disabled && (!this.isActive || !mandatory)) {
        this.$refs.input.checked = true;
        this.isActive = true;
        this.$emit('change', this.value);
      }
    }
  },

  mounted: function mounted() {
    this.radio.register(this);
  },
  beforeDestroy: function beforeDestroy() {
    this.radio.unregister(this);
  },
  render: function render(h) {
    var transition = h(_transitions.VFadeTransition, {}, [h(_VIcon2.default, {
      staticClass: 'icon--selection-control',
      'class': {
        'icon--radio': this.isActive
      },
      key: this.icon,
      on: Object.assign({
        click: this.toggle
      }, this.$listeners)
    }, this.icon)]);

    var ripple = this.ripple ? this.genRipple() : null;

    return this.genWrapper([transition, ripple]);
  }
};