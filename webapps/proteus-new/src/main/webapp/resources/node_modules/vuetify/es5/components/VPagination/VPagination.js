'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_pagination.styl');

var _VIcon = require('../VIcon');

var _VIcon2 = _interopRequireDefault(_VIcon);

var _resize = require('../../directives/resize');

var _resize2 = _interopRequireDefault(_resize);

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

exports.default = {
  name: 'v-pagination',

  mixins: [_colorable2.default],

  directives: { Resize: _resize2.default },

  data: function data() {
    return {
      maxButtons: 0,
      defaultColor: 'primary'
    };
  },


  props: {
    circle: Boolean,
    disabled: Boolean,
    length: {
      type: Number,
      default: 0,
      validator: function validator(val) {
        return val % 1 === 0;
      }
    },
    totalVisible: [Number, String],
    nextIcon: {
      type: String,
      default: 'chevron_right'
    },
    prevIcon: {
      type: String,
      default: 'chevron_left'
    },
    value: {
      type: Number,
      default: 0
    }
  },

  computed: {
    classes: function classes() {
      return {
        'pagination': true,
        'pagination--circle': this.circle,
        'pagination--disabled': this.disabled
      };
    },
    items: function items() {
      var maxLength = this.totalVisible || this.maxButtons;
      if (this.length <= maxLength) {
        return this.range(1, this.length);
      }

      var even = maxLength % 2 === 0 ? 1 : 0;
      var left = Math.floor(maxLength / 2);
      var right = this.length - left + 1 + even;

      if (this.value >= left && this.value <= right) {
        var start = this.value - left + 2;
        var end = this.value + left - 2 - even;

        return [1, '...'].concat(_toConsumableArray(this.range(start, end)), ['...', this.length]);
      } else {
        return [].concat(_toConsumableArray(this.range(1, left)), ['...'], _toConsumableArray(this.range(this.length - left + 1 + even, this.length)));
      }
    }
  },

  watch: {
    value: function value() {
      this.init();
    }
  },

  mounted: function mounted() {
    this.init();
  },


  methods: {
    init: function init() {
      var _this = this;

      this.selected = null;

      this.$nextTick(this.onResize);
      // TODO: Change this (f75dee3a, cbdf7caa)
      setTimeout(function () {
        return _this.selected = _this.value;
      }, 100);
    },
    onResize: function onResize() {
      var width = this.$el && this.$el.parentNode ? this.$el.parentNode.clientWidth : window.innerWidth;

      this.maxButtons = Math.floor((width - 96) / 42);
    },
    next: function next(e) {
      e.preventDefault();
      this.$emit('input', this.value + 1);
      this.$emit('next');
    },
    previous: function previous(e) {
      e.preventDefault();
      this.$emit('input', this.value - 1);
      this.$emit('previous');
    },
    range: function range(from, to) {
      var range = [];

      from = from > 0 ? from : 1;

      for (var i = from; i <= to; i++) {
        range.push(i);
      }

      return range;
    },
    genIcon: function genIcon(h, icon, disabled, fn) {
      return h('li', [h('button', {
        staticClass: 'pagination__navigation',
        class: {
          'pagination__navigation--disabled': disabled
        },
        on: disabled ? {} : { click: fn }
      }, [h(_VIcon2.default, [icon])])]);
    },
    genItem: function genItem(h, i) {
      var _this2 = this;

      return h('button', {
        staticClass: 'pagination__item',
        class: i === this.value ? this.addBackgroundColorClassChecks({
          'pagination__item--active': true
        }) : {},
        on: {
          click: function click() {
            return _this2.$emit('input', i);
          }
        }
      }, [i]);
    },
    genItems: function genItems(h) {
      var _this3 = this;

      return this.items.map(function (i, index) {
        return h('li', { key: index }, [isNaN(i) ? h('span', { class: 'pagination__more' }, [i]) : _this3.genItem(h, i)]);
      });
    }
  },

  render: function render(h) {
    var children = [this.genIcon(h, this.prevIcon, this.value <= 1, this.previous), this.genItems(h), this.genIcon(h, this.nextIcon, this.value >= this.length, this.next)];

    return h('ul', {
      directives: [{
        modifiers: { quiet: true },
        name: 'resize',
        value: this.onResize
      }],
      class: this.classes
    }, children);
  }
};