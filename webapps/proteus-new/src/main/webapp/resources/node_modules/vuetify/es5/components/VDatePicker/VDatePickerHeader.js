'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

// Components


// Mixins


// Utils


require('../../../src/stylus/components/_date-picker-header.styl');

var _VBtn = require('../VBtn');

var _VBtn2 = _interopRequireDefault(_VBtn);

var _VIcon = require('../VIcon');

var _VIcon2 = _interopRequireDefault(_VIcon);

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _util = require('./util');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-date-picker-header',

  mixins: [_colorable2.default],

  data: function data() {
    return {
      isReversing: false,
      defaultColor: 'accent'
    };
  },


  props: {
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
    nextIcon: {
      type: String,
      default: 'chevron_right'
    },
    prevIcon: {
      type: String,
      default: 'chevron_left'
    },
    value: {
      type: [Number, String],
      required: true
    }
  },

  computed: {
    formatter: function formatter() {
      if (this.format) {
        return this.format;
      } else if (String(this.value).split('-')[1]) {
        return (0, _util.createNativeLocaleFormatter)(this.locale, { month: 'long', year: 'numeric', timeZone: 'UTC' }, { length: 7 });
      } else {
        return (0, _util.createNativeLocaleFormatter)(this.locale, { year: 'numeric', timeZone: 'UTC' }, { length: 4 });
      }
    }
  },

  watch: {
    value: function value(newVal, oldVal) {
      this.isReversing = newVal < oldVal;
    }
  },

  methods: {
    genBtn: function genBtn(change) {
      var _this = this;

      var disabled = this.disabled || change < 0 && this.min && this.calculateChange(change) < this.min || change > 0 && this.max && this.calculateChange(change) > this.max;

      return this.$createElement(_VBtn2.default, {
        props: {
          dark: this.dark,
          disabled: disabled,
          icon: true
        },
        nativeOn: {
          click: function click(e) {
            e.stopPropagation();
            _this.$emit('input', _this.calculateChange(change));
          }
        }
      }, [this.$createElement(_VIcon2.default, change < 0 ? this.prevIcon : this.nextIcon)]);
    },
    calculateChange: function calculateChange(sign) {
      var _String$split$map = String(this.value).split('-').map(function (v) {
        return 1 * v;
      }),
          _String$split$map2 = _slicedToArray(_String$split$map, 2),
          year = _String$split$map2[0],
          month = _String$split$map2[1];

      if (month == null) {
        return '' + (year + sign);
      } else {
        return (0, _util.monthChange)(String(this.value), sign);
      }
    },
    genHeader: function genHeader() {
      var _this2 = this;

      var header = this.$createElement('strong', {
        'class': this.disabled ? undefined : this.addTextColorClassChecks(),
        key: String(this.value),
        on: {
          click: function click() {
            return _this2.$emit('toggle');
          }
        }
      }, [this.$slots.default || this.formatter(String(this.value))]);

      var transition = this.$createElement('transition', {
        props: {
          name: this.isReversing ? 'tab-reverse-transition' : 'tab-transition'
        }
      }, [header]);

      return this.$createElement('div', {
        staticClass: 'date-picker-header__value',
        class: {
          'date-picker-header__value--disabled': this.disabled
        }
      }, [transition]);
    }
  },

  render: function render(h) {
    return this.$createElement('div', {
      staticClass: 'date-picker-header'
    }, [this.genBtn(-1), this.genHeader(), this.genBtn(+1)]);
  }
};