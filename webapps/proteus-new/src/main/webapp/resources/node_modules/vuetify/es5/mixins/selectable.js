'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _colorable = require('./colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _input = require('./input');

var _input2 = _interopRequireDefault(_input);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'selectable',

  mixins: [_input2.default, _colorable2.default],

  model: {
    prop: 'inputValue',
    event: 'change'
  },

  data: function data() {
    return {
      defaultColor: 'accent'
    };
  },

  props: {
    id: String,
    inputValue: null,
    falseValue: null,
    trueValue: null
  },

  computed: {
    isActive: function isActive() {
      if (Array.isArray(this.inputValue)) {
        return this.inputValue.indexOf(this.value) !== -1;
      }

      if (!this.trueValue || !this.falseValue) {
        return this.value ? this.value === this.inputValue : Boolean(this.inputValue);
      }

      return this.inputValue === this.trueValue;
    },
    isDirty: function isDirty() {
      return this.isActive;
    }
  },

  watch: {
    indeterminate: function indeterminate(val) {
      this.inputIndeterminate = val;
    }
  },

  methods: {
    genLabel: function genLabel() {
      return this.$createElement('label', {
        on: { click: this.toggle },
        attrs: {
          for: this.id
        }
      }, this.$slots.label || this.label);
    },
    toggle: function toggle() {
      if (this.disabled) {
        return;
      }

      var input = this.inputValue;
      if (Array.isArray(input)) {
        input = input.slice();
        var i = input.indexOf(this.value);

        if (i === -1) {
          input.push(this.value);
        } else {
          input.splice(i, 1);
        }
      } else if (this.trueValue || this.falseValue) {
        input = input === this.trueValue ? this.falseValue : this.trueValue;
      } else if (this.value) {
        input = this.value === this.inputValue ? null : this.value;
      } else {
        input = !input;
      }

      this.validate(true, input);

      this.$emit('change', input);
    }
  }
};