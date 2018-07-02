'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_button-toggle.styl');

var _buttonGroup = require('../../mixins/button-group');

var _buttonGroup2 = _interopRequireDefault(_buttonGroup);

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

var _console = require('../../util/console');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-btn-toggle',

  model: {
    prop: 'inputValue',
    event: 'change'
  },

  mixins: [_buttonGroup2.default, _themeable2.default],

  props: {
    inputValue: {
      required: false
    },
    mandatory: Boolean,
    multiple: Boolean
  },

  computed: {
    classes: function classes() {
      return {
        'btn-toggle': true,
        'btn-toggle--selected': this.hasValue,
        'theme--light': this.light,
        'theme--dark': this.dark
      };
    },
    hasValue: function hasValue() {
      return this.multiple && this.inputValue.length || !this.multiple && this.inputValue !== null && typeof this.inputValue !== 'undefined';
    }
  },

  watch: {
    inputValue: {
      handler: function handler() {
        this.update();
      },

      deep: true
    }
  },

  methods: {
    isSelected: function isSelected(i) {
      var item = this.getValue(i);
      if (!this.multiple) {
        return this.inputValue === item;
      }

      return this.inputValue.includes(item);
    },
    updateValue: function updateValue(i) {
      var item = this.getValue(i);
      if (!this.multiple) {
        if (this.mandatory && this.inputValue === item) return;
        return this.$emit('change', this.inputValue === item ? null : item);
      }

      var items = this.inputValue.slice();

      var index = items.indexOf(item);
      if (index > -1) {
        if (this.mandatory && items.length === 1) return;
        items.length >= 1 && items.splice(index, 1);
      } else {
        items.push(item);
      }

      this.$emit('change', items);
    },
    updateAllValues: function updateAllValues() {
      if (!this.multiple) return;

      var items = [];

      for (var i = 0; i < this.buttons.length; ++i) {
        var item = this.getValue(i);
        var index = this.inputValue.indexOf(item);
        if (index !== -1) {
          items.push(item);
        }
      }

      this.$emit('change', items);
    }
  },

  created: function created() {
    if (this.multiple && !Array.isArray(this.inputValue)) {
      (0, _console.consoleWarn)('Model must be bound to an array if the multiple property is true.', this);
    }
  },
  render: function render(h) {
    return h('div', { class: this.classes }, this.$slots.default);
  }
};