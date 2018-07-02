'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _ripple = require('../directives/ripple');

var _ripple2 = _interopRequireDefault(_ripple);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/** @mixin */
exports.default = {
  name: 'rippleable',

  directives: { Ripple: _ripple2.default },

  props: {
    ripple: {
      type: [Boolean, Object],
      default: true
    }
  },

  methods: {
    genRipple: function genRipple() {
      var _this = this;

      var data = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : { directives: [] };

      data.class = this.rippleClasses || 'input-group--selection-controls__ripple';
      data.directives.push({
        name: 'ripple',
        value: this.ripple && !this.disabled && { center: true }
      });
      data.on = Object.assign({}, this.$listeners, {
        click: function click(e) {
          _this.$emit('click', e);
          _this.toggle();
        }
      });

      return this.$createElement('div', data);
    }
  }
};