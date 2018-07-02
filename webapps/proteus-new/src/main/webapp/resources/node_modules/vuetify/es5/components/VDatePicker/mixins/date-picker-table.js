'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../../src/stylus/components/_date-picker-table.styl');

var _touch = require('../../../directives/touch');

var _touch2 = _interopRequireDefault(_touch);

var _isDateAllowed = require('.././util/isDateAllowed');

var _isDateAllowed2 = _interopRequireDefault(_isDateAllowed);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Directives
exports.default = {
  directives: { Touch: _touch2.default },

  data: function data() {
    return {
      defaultColor: 'accent',
      isReversing: false
    };
  },


  props: {
    allowedDates: Function,
    current: String,
    disabled: Boolean,
    format: {
      type: Function,
      default: null
    },
    locale: {
      type: String,
      default: 'en-us'
    },
    min: String,
    max: String,
    scrollable: Boolean,
    tableDate: {
      type: String,
      required: true
    },
    value: {
      type: String,
      required: false
    }
  },

  computed: {
    computedTransition: function computedTransition() {
      return this.isReversing ? 'tab-reverse-transition' : 'tab-transition';
    },
    displayedMonth: function displayedMonth() {
      return this.tableDate.split('-')[1] - 1;
    },
    displayedYear: function displayedYear() {
      return this.tableDate.split('-')[0] * 1;
    }
  },

  watch: {
    tableDate: function tableDate(newVal, oldVal) {
      this.isReversing = newVal < oldVal;
    }
  },

  methods: {
    genButtonClasses: function genButtonClasses(value, isDisabled, isFloating) {
      var isSelected = value === this.value;
      var isCurrent = value === this.current;

      var classes = {
        'btn--active': isSelected,
        'btn--flat': !isSelected,
        'btn--icon': isSelected && !isDisabled && isFloating,
        'btn--floating': isFloating,
        'btn--depressed': !isFloating && isSelected,
        'btn--disabled': isDisabled || this.disabled && isSelected,
        'btn--outline': isCurrent && !isSelected
      };

      if (isSelected) return this.addBackgroundColorClassChecks(classes);
      if (isCurrent) return this.addTextColorClassChecks(classes);
      return classes;
    },
    genButton: function genButton(value, isFloating) {
      var _this = this;

      var isDisabled = !(0, _isDateAllowed2.default)(value, this.min, this.max, this.allowedDates);

      return this.$createElement('button', {
        staticClass: 'btn',
        'class': this.genButtonClasses(value, isDisabled, isFloating),
        attrs: {
          type: 'button'
        },
        domProps: {
          disabled: isDisabled,
          innerHTML: '<div class="btn__content">' + this.formatter(value) + '</div>'
        },
        on: isDisabled ? {} : {
          click: function click() {
            return _this.$emit('input', value);
          }
        }
      });
    },
    wheel: function wheel(e) {
      e.preventDefault();
      this.$emit('tableDate', this.calculateTableDate(e.deltaY));
    },
    touch: function touch(value) {
      this.$emit('tableDate', this.calculateTableDate(value));
    },
    genTable: function genTable(staticClass, children) {
      var _this2 = this;

      var transition = this.$createElement('transition', {
        props: { name: this.computedTransition }
      }, [this.$createElement('table', { key: this.tableDate }, children)]);

      var touchDirective = {
        name: 'touch',
        value: {
          left: function left(e) {
            return e.offsetX < -15 && _this2.touch(1);
          },
          right: function right(e) {
            return e.offsetX > 15 && _this2.touch(-1);
          }
        }
      };

      return this.$createElement('div', {
        staticClass: staticClass,
        on: this.scrollable ? { wheel: this.wheel } : undefined,
        directives: [touchDirective]
      }, [transition]);
    }
  }
};

// Utils