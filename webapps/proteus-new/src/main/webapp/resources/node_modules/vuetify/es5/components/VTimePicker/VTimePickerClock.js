'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_time-picker-clock.styl');

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mixins
exports.default = {
  name: 'v-time-picker-clock',

  mixins: [_colorable2.default, _themeable2.default],

  data: function data() {
    return {
      defaultColor: 'accent',
      inputValue: this.value,
      isDragging: false
    };
  },


  props: {
    allowedValues: Function,
    double: Boolean,
    format: {
      type: Function,
      default: function _default(val) {
        return val;
      }
    },
    max: {
      type: Number,
      required: true
    },
    min: {
      type: Number,
      required: true
    },
    scrollable: Boolean,
    rotate: {
      type: Number,
      default: 0
    },
    size: {
      type: [Number, String],
      default: 270
    },
    step: {
      type: Number,
      default: 1
    },
    value: Number
  },

  computed: {
    count: function count() {
      return this.max - this.min + 1;
    },
    innerRadius: function innerRadius() {
      return this.radius - Math.max(this.radius * 0.4, 48);
    },
    outerRadius: function outerRadius() {
      return this.radius - 4;
    },
    roundCount: function roundCount() {
      return this.double ? this.count / 2 : this.count;
    },
    degreesPerUnit: function degreesPerUnit() {
      return 360 / this.roundCount;
    },
    degrees: function degrees() {
      return this.degreesPerUnit * Math.PI / 180;
    },
    radius: function radius() {
      return this.size / 2;
    },
    displayedValue: function displayedValue() {
      return this.value == null ? this.min : this.value;
    }
  },

  watch: {
    value: function value(_value) {
      this.inputValue = _value;
    }
  },

  methods: {
    wheel: function wheel(e) {
      e.preventDefault();
      var value = this.displayedValue + Math.sign(e.wheelDelta || 1);
      this.update((value - this.min + this.count) % this.count + this.min);
    },
    handScale: function handScale(value) {
      return this.double && value - this.min >= this.roundCount ? this.innerRadius / this.radius : this.outerRadius / this.radius;
    },
    isAllowed: function isAllowed(value) {
      return !this.allowedValues || this.allowedValues(value);
    },
    genValues: function genValues() {
      var children = [];

      for (var value = this.min; value <= this.max; value = value + this.step) {
        var classes = {
          active: value === this.displayedValue,
          disabled: !this.isAllowed(value)
        };

        children.push(this.$createElement('span', {
          'class': this.addBackgroundColorClassChecks(classes, value === this.value ? this.computedColor : null),
          style: this.getTransform(value),
          domProps: { innerHTML: '<span>' + this.format(value) + '</span>' }
        }));
      }

      return children;
    },
    genHand: function genHand() {
      var scale = 'scaleY(' + this.handScale(this.displayedValue) + ')';
      var angle = this.rotate + this.degreesPerUnit * (this.displayedValue - this.min);

      return this.$createElement('div', {
        staticClass: 'time-picker-clock__hand',
        'class': this.value == null ? {} : this.addBackgroundColorClassChecks(),
        style: {
          transform: 'rotate(' + angle + 'deg) ' + scale
        }
      });
    },
    getTransform: function getTransform(i) {
      var _getPosition = this.getPosition(i),
          x = _getPosition.x,
          y = _getPosition.y;

      return { transform: 'translate(' + x + 'px, ' + y + 'px)' };
    },
    getPosition: function getPosition(value) {
      var radius = (this.radius - 24) * this.handScale(value);
      var rotateRadians = this.rotate * Math.PI / 180;
      return {
        x: Math.round(Math.sin((value - this.min) * this.degrees + rotateRadians) * radius),
        y: Math.round(-Math.cos((value - this.min) * this.degrees + rotateRadians) * radius)
      };
    },
    onMouseDown: function onMouseDown(e) {
      e.preventDefault();

      this.isDragging = true;
      this.onDragMove(e);
    },
    onMouseUp: function onMouseUp() {
      this.isDragging = false;
      this.isAllowed(this.inputValue) && this.$emit('change', this.inputValue);
    },
    onDragMove: function onDragMove(e) {
      e.preventDefault();
      if (!this.isDragging && e.type !== 'click') return;

      var _$refs$clock$getBound = this.$refs.clock.getBoundingClientRect(),
          width = _$refs$clock$getBound.width,
          top = _$refs$clock$getBound.top,
          left = _$refs$clock$getBound.left;

      var _ref = 'touches' in e ? e.touches[0] : e,
          clientX = _ref.clientX,
          clientY = _ref.clientY;

      var center = { x: width / 2, y: -width / 2 };
      var coords = { x: clientX - left, y: top - clientY };
      var handAngle = Math.round(this.angle(center, coords) - this.rotate + 360) % 360;
      var insideClick = this.double && this.euclidean(center, coords) < (this.outerRadius + this.innerRadius) / 2 - 16;
      var value = Math.round(handAngle / this.degreesPerUnit) + this.min + (insideClick ? this.roundCount : 0);

      // Necessary to fix edge case when selecting left part of max value
      if (handAngle >= 360 - this.degreesPerUnit / 2) {
        this.update(insideClick ? this.max : this.min);
      } else {
        this.update(value);
      }
    },
    update: function update(value) {
      if (this.inputValue !== value && this.isAllowed(value)) {
        this.inputValue = value;
        this.$emit('input', value);
      }
    },
    euclidean: function euclidean(p0, p1) {
      var dx = p1.x - p0.x;
      var dy = p1.y - p0.y;

      return Math.sqrt(dx * dx + dy * dy);
    },
    angle: function angle(center, p1) {
      var value = 2 * Math.atan2(p1.y - center.y - this.euclidean(center, p1), p1.x - center.x);
      return Math.abs(value * 180 / Math.PI);
    }
  },

  render: function render(h) {
    var _this = this;

    var data = {
      staticClass: 'time-picker-clock',
      class: {
        'time-picker-clock--indeterminate': this.value == null
      },
      on: {
        mousedown: this.onMouseDown,
        mouseup: this.onMouseUp,
        mouseleave: function mouseleave() {
          return _this.isDragging && _this.onMouseUp();
        },
        touchstart: this.onMouseDown,
        touchend: this.onMouseUp,
        mousemove: this.onDragMove,
        touchmove: this.onDragMove
      },
      style: {
        height: this.size + 'px',
        width: this.size + 'px'
      },
      ref: 'clock'
    };

    this.scrollable && (data.on.wheel = this.wheel);

    return this.$createElement('div', data, [this.genHand(), this.genValues()]);
  }
};