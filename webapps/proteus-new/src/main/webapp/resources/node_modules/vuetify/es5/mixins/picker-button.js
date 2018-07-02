'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  methods: {
    genPickerButton: function genPickerButton(prop, value, content) {
      var _this = this;

      var staticClass = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : '';

      var active = this[prop] === value;
      var click = function click(event) {
        event.stopPropagation();
        _this.$emit('update:' + prop, value);
      };

      return this.$createElement('div', {
        staticClass: ('picker__title__btn ' + staticClass).trim(),
        'class': { active: active },
        on: active ? undefined : { click: click }
      }, Array.isArray(content) ? content : [content]);
    }
  }
};