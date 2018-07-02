'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VIcon = require('../VIcon');

var _VIcon2 = _interopRequireDefault(_VIcon);

var _ripple = require('../../directives/ripple');

var _ripple2 = _interopRequireDefault(_ripple);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-stepper-step',

  directives: { Ripple: _ripple2.default },

  inject: ['stepClick'],

  data: function data() {
    return {
      isActive: false,
      isInactive: true
    };
  },


  props: {
    complete: Boolean,
    completeIcon: {
      type: String,
      default: 'check'
    },
    editIcon: {
      type: String,
      default: 'edit'
    },
    errorIcon: {
      type: String,
      default: 'warning'
    },
    editable: Boolean,
    rules: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    step: [Number, String]
  },

  computed: {
    classes: function classes() {
      return {
        'stepper__step': true,
        'stepper__step--active': this.isActive,
        'stepper__step--editable': this.editable,
        'stepper__step--inactive': this.isInactive,
        'stepper__step--error': this.hasError,
        'stepper__step--complete': this.complete,
        'error--text': this.hasError
      };
    },
    hasError: function hasError() {
      return this.rules.some(function (i) {
        return i() !== true;
      });
    }
  },

  methods: {
    click: function click(e) {
      e.stopPropagation();

      if (this.editable) {
        this.stepClick(this.step);
      }
    },
    toggle: function toggle(step) {
      this.isActive = step.toString() === this.step.toString();
      this.isInactive = Number(step) < Number(this.step);
    }
  },

  render: function render(h) {
    var data = {
      'class': this.classes,
      directives: [{
        name: 'ripple',
        value: this.editable
      }],
      on: { click: this.click }
    };
    var stepContent = void 0;

    if (this.hasError) {
      stepContent = [h(_VIcon2.default, {}, this.errorIcon)];
    } else if (this.complete) {
      if (this.editable) {
        stepContent = [h(_VIcon2.default, {}, this.editIcon)];
      } else {
        stepContent = [h(_VIcon2.default, {}, this.completeIcon)];
      }
    } else {
      stepContent = this.step;
    }

    var step = h('span', {
      staticClass: 'stepper__step__step',
      'class': {
        'primary': !this.hasError && (this.complete || this.isActive)
      }
    }, stepContent);

    var label = h('div', {
      staticClass: 'stepper__label'
    }, this.$slots.default);

    return h('div', data, [step, label]);
  }
};