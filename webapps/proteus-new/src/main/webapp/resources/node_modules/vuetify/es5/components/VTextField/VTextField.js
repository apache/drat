'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // Styles


// Mixins


require('../../../src/stylus/components/_input-groups.styl');

require('../../../src/stylus/components/_text-fields.styl');

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _input = require('../../mixins/input');

var _input2 = _interopRequireDefault(_input);

var _maskable = require('../../mixins/maskable');

var _maskable2 = _interopRequireDefault(_maskable);

var _soloable = require('../../mixins/soloable');

var _soloable2 = _interopRequireDefault(_soloable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var dirtyTypes = ['color', 'file', 'time', 'date', 'datetime-local', 'week', 'month'];

exports.default = {
  name: 'v-text-field',

  mixins: [_colorable2.default, _input2.default, _maskable2.default, _soloable2.default],

  inheritAttrs: false,

  data: function data() {
    return {
      initialValue: null,
      inputHeight: null,
      internalChange: false,
      badInput: false
    };
  },


  props: {
    autofocus: Boolean,
    autoGrow: Boolean,
    box: Boolean,
    clearable: Boolean,
    color: {
      type: String,
      default: 'primary'
    },
    counter: [Boolean, Number, String],
    fullWidth: Boolean,
    multiLine: Boolean,
    noResize: Boolean,
    placeholder: String,
    prefix: String,
    rowHeight: {
      type: [Number, String],
      default: 24,
      validator: function validator(v) {
        return !isNaN(parseFloat(v));
      }
    },
    rows: {
      type: [Number, String],
      default: 5,
      validator: function validator(v) {
        return !isNaN(parseInt(v, 10));
      }
    },
    singleLine: Boolean,
    suffix: String,
    textarea: Boolean,
    type: {
      type: String,
      default: 'text'
    }
  },

  computed: {
    classes: function classes() {
      var classes = _extends({}, this.genSoloClasses(), {
        'input-group--text-field': true,
        'input-group--text-field-box': this.box,
        'input-group--single-line': this.singleLine || this.isSolo,
        'input-group--multi-line': this.multiLine,
        'input-group--full-width': this.fullWidth,
        'input-group--no-resize': this.noResizeHandle,
        'input-group--prefix': this.prefix,
        'input-group--suffix': this.suffix,
        'input-group--textarea': this.textarea
      });

      if (this.hasError) {
        classes['error--text'] = true;
      } else {
        return this.addTextColorClassChecks(classes);
      }

      return classes;
    },
    count: function count() {
      var inputLength = void 0;
      if (this.inputValue) inputLength = this.inputValue.toString().length;else inputLength = 0;

      return inputLength + ' / ' + this.counterLength;
    },
    counterLength: function counterLength() {
      var parsedLength = parseInt(this.counter, 10);
      return isNaN(parsedLength) ? 25 : parsedLength;
    },

    inputValue: {
      get: function get() {
        return this.lazyValue;
      },
      set: function set(val) {
        if (this.mask) {
          this.lazyValue = this.unmaskText(this.maskText(this.unmaskText(val)));
          this.setSelectionRange();
        } else {
          this.lazyValue = val;
          this.$emit('input', this.lazyValue);
        }
      }
    },
    isDirty: function isDirty() {
      return this.lazyValue != null && this.lazyValue.toString().length > 0 || this.badInput || dirtyTypes.includes(this.type);
    },
    isTextarea: function isTextarea() {
      return this.multiLine || this.textarea;
    },
    noResizeHandle: function noResizeHandle() {
      return this.isTextarea && (this.noResize || this.shouldAutoGrow);
    },
    shouldAutoGrow: function shouldAutoGrow() {
      return this.isTextarea && this.autoGrow;
    }
  },

  watch: {
    isFocused: function isFocused(val) {
      if (val) {
        this.initialValue = this.lazyValue;
      } else if (this.initialValue !== this.lazyValue) {
        this.$emit('change', this.lazyValue);
      }
    },
    value: function value(val) {
      var _this = this;

      if (this.mask && !this.internalChange) {
        var masked = this.maskText(this.unmaskText(val));
        this.lazyValue = this.unmaskText(masked);

        // Emit when the externally set value was modified internally
        String(val) !== this.lazyValue && this.$nextTick(function () {
          _this.$refs.input.value = masked;
          _this.$emit('input', _this.lazyValue);
        });
      } else this.lazyValue = val;

      if (this.internalChange) this.internalChange = false;

      !this.validateOnBlur && this.validate();
      this.shouldAutoGrow && this.calculateInputHeight();
    }
  },

  mounted: function mounted() {
    this.shouldAutoGrow && this.calculateInputHeight();
    this.autofocus && this.focus();
  },


  methods: {
    calculateInputHeight: function calculateInputHeight() {
      var _this2 = this;

      this.inputHeight = null;

      this.$nextTick(function () {
        var height = _this2.$refs.input ? _this2.$refs.input.scrollHeight : 0;
        var minHeight = parseInt(_this2.rows, 10) * parseFloat(_this2.rowHeight);
        _this2.inputHeight = Math.max(minHeight, height);
      });
    },
    onInput: function onInput(e) {
      this.mask && this.resetSelections(e.target);
      this.inputValue = e.target.value;
      this.badInput = e.target.validity && e.target.validity.badInput;
      this.shouldAutoGrow && this.calculateInputHeight();
    },
    blur: function blur(e) {
      var _this3 = this;

      this.isFocused = false;
      // Reset internalChange state
      // to allow external change
      // to persist
      this.internalChange = false;

      this.$nextTick(function () {
        _this3.validate();
      });
      this.$emit('blur', e);
    },
    focus: function focus(e) {
      if (!this.$refs.input) return;

      this.isFocused = true;
      if (document.activeElement !== this.$refs.input) {
        this.$refs.input.focus();
      }
      this.$emit('focus', e);
    },
    keyDown: function keyDown(e) {
      // Prevents closing of a
      // dialog when pressing
      // enter
      if (this.isTextarea && this.isFocused && e.keyCode === 13) {
        e.stopPropagation();
      }

      this.internalChange = true;
    },
    genCounter: function genCounter() {
      return this.$createElement('div', {
        'class': {
          'input-group__counter': true,
          'input-group__counter--error': this.hasError
        }
      }, this.count);
    },
    genInput: function genInput() {
      var tag = this.isTextarea ? 'textarea' : 'input';
      var listeners = Object.assign({}, this.$listeners);
      delete listeners['change']; // Change should not be bound externally

      var data = {
        style: {},
        domProps: {
          value: this.maskText(this.lazyValue)
        },
        attrs: _extends({}, this.$attrs, {
          autofocus: this.autofocus,
          disabled: this.disabled,
          required: this.required,
          readonly: this.readonly,
          tabindex: this.tabindex,
          'aria-label': (!this.$attrs || !this.$attrs.id) && this.label // Label `for` will be set if we have an id
        }),
        on: Object.assign(listeners, {
          blur: this.blur,
          input: this.onInput,
          focus: this.focus,
          keydown: this.keyDown
        }),
        ref: 'input'
      };

      if (this.shouldAutoGrow) {
        data.style.height = this.inputHeight && this.inputHeight + 'px';
      }

      if (this.placeholder) data.attrs.placeholder = this.placeholder;

      if (!this.isTextarea) {
        data.attrs.type = this.type;
      } else {
        data.attrs.rows = this.rows;
      }

      if (this.mask) {
        data.attrs.maxlength = this.masked.length;
      }

      var children = [this.$createElement(tag, data)];

      this.prefix && children.unshift(this.genFix('prefix'));
      this.suffix && children.push(this.genFix('suffix'));

      return children;
    },
    genFix: function genFix(type) {
      return this.$createElement('span', {
        'class': 'input-group--text-field__' + type
      }, this[type]);
    },
    clearableCallback: function clearableCallback() {
      var _this4 = this;

      this.inputValue = null;
      this.$nextTick(function () {
        return _this4.$refs.input.focus();
      });
    }
  },

  render: function render() {
    return this.genInputGroup(this.genInput(), { attrs: { tabindex: false } });
  }
};