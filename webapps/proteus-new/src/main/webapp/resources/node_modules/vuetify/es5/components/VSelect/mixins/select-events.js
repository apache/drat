'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

/**
 * Select events
 *
 * @mixin
 *
 * Event based methods for
 * the v-select component
 */
exports.default = {
  methods: {
    blur: function blur() {
      this.deactivateInput();
      this.menuIsActive = false;
      this.$emit('blur');
    },
    focus: function focus() {
      this.showMenu();

      this.$emit('focus');
    },
    focusInput: function focusInput() {
      var _this = this;

      if (this.$refs.input && this.isAutocomplete) {
        this.$refs.input.focus();

        this.$nextTick(function () {
          _this.$refs.input.select();
          _this.shouldBreak && (_this.$refs.input.scrollLeft = _this.$refs.input.scrollWidth);
        });
      } else {
        !this.isFocused && this.$el.focus();
      }
    },
    genListeners: function genListeners() {
      var _this2 = this;

      var listeners = Object.assign({}, this.$listeners);
      delete listeners.input;

      return _extends({}, listeners, {
        click: function click() {
          if (_this2.disabled || _this2.readonly) return;

          if (_this2.isFocused && !_this2.menuIsVisible) {
            return _this2.showMenuItems();
          }

          _this2.selectedIndex > -1 ? _this2.selectedIndex = -1 : _this2.focus();
        },
        focus: function focus(e) {
          if (_this2.disabled || _this2.readonly || _this2.isFocused) {
            return;
          }

          _this2.activateInput();
          _this2.$nextTick(_this2.focusInput);
        },
        keydown: this.onKeyDown // Located in mixins/select-autocomplete.js
      });
    }
  }
};