'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_alerts.styl');

var _VIcon = require('../VIcon');

var _VIcon2 = _interopRequireDefault(_VIcon);

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _toggleable = require('../../mixins/toggleable');

var _toggleable2 = _interopRequireDefault(_toggleable);

var _transitionable = require('../../mixins/transitionable');

var _transitionable2 = _interopRequireDefault(_transitionable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-alert',

  mixins: [_colorable2.default, _toggleable2.default, _transitionable2.default],

  props: {
    dismissible: Boolean,
    icon: String,
    outline: Boolean,
    type: {
      type: String,
      validator: function validator(val) {
        return ['info', 'error', 'success', 'warning'].includes(val);
      }
    }
  },

  data: function data() {
    return {
      defaultColor: 'error'
    };
  },

  computed: {
    classes: function classes() {
      var color = this.type && !this.color ? this.type : this.computedColor;
      var classes = {
        'alert--dismissible': this.dismissible,
        'alert--outline': this.outline
      };

      return this.outline ? this.addTextColorClassChecks(classes, color) : this.addBackgroundColorClassChecks(classes, color);
    },
    computedIcon: function computedIcon() {
      if (this.icon || !this.type) return this.icon;

      switch (this.type) {
        case 'info':
          return 'info';
        case 'error':
          return 'warning';
        case 'success':
          return 'check_circle';
        case 'warning':
          return 'priority_high';
      }
    }
  },

  render: function render(h) {
    var _this = this;

    var children = [h('div', this.$slots.default)];

    if (this.computedIcon) {
      children.unshift(h(_VIcon2.default, {
        'class': 'alert__icon'
      }, this.computedIcon));
    }

    if (this.dismissible) {
      var close = h('a', {
        'class': 'alert__dismissible',
        on: { click: function click() {
            return _this.$emit('input', false);
          } }
      }, [h(_VIcon2.default, {
        props: {
          right: true
        }
      }, 'cancel')]);

      children.push(close);
    }

    var alert = h('div', {
      staticClass: 'alert',
      'class': this.classes,
      directives: [{
        name: 'show',
        value: this.isActive
      }],
      on: this.$listeners
    }, children);

    if (!this.transition) return alert;

    return h('transition', {
      props: {
        name: this.transition,
        origin: this.origin,
        mode: this.mode
      }
    }, [alert]);
  }
};