'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_steppers.styl');

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-stepper',

  mixins: [_themeable2.default],

  provide: function provide() {
    return {
      stepClick: this.stepClick
    };
  },
  data: function data() {
    return {
      inputValue: null,
      isBooted: false,
      steps: [],
      content: [],
      isReverse: false
    };
  },


  props: {
    nonLinear: Boolean,
    altLabels: Boolean,
    vertical: Boolean,
    value: [Number, String]
  },

  computed: {
    classes: function classes() {
      return {
        'stepper': true,
        'stepper--is-booted': this.isBooted,
        'stepper--vertical': this.vertical,
        'stepper--alt-labels': this.altLabels,
        'stepper--non-linear': this.nonLinear,
        'theme--dark': this.dark,
        'theme--light': this.light
      };
    }
  },

  watch: {
    inputValue: function inputValue(val, prev) {
      this.isReverse = Number(val) < Number(prev);
      for (var index = this.steps.length; --index >= 0;) {
        this.steps[index].toggle(this.inputValue);
      }
      for (var _index = this.content.length; --_index >= 0;) {
        this.content[_index].toggle(this.inputValue, this.isReverse);
      }

      this.$emit('input', this.inputValue);
      prev && (this.isBooted = true);
    },
    value: function value() {
      var _this = this;

      this.getSteps();
      this.$nextTick(function () {
        return _this.inputValue = _this.value;
      });
    }
  },

  mounted: function mounted() {
    this.getSteps();

    this.inputValue = this.value || this.steps[0].step || 1;
  },


  methods: {
    getSteps: function getSteps() {
      this.steps = [];
      this.content = [];
      for (var index = 0; index < this.$children.length; index++) {
        var child = this.$children[index];
        // TODO: use the component name instead of tag
        if (child.$options._componentTag === 'v-stepper-step') {
          this.steps.push(child);
        } else if (child.$options._componentTag === 'v-stepper-content') {
          child.isVertical = this.vertical;
          this.content.push(child);
        }
      }
    },
    stepClick: function stepClick(step) {
      var _this2 = this;

      this.getSteps();
      this.$nextTick(function () {
        return _this2.inputValue = step;
      });
    }
  },

  render: function render(h) {
    return h('div', {
      'class': this.classes
    }, this.$slots.default);
  }
};