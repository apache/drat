'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'returnable',

  data: function data() {
    return {
      originalValue: null
    };
  },

  props: {
    returnValue: null
  },

  watch: {
    isActive: function isActive(val) {
      if (val) {
        this.originalValue = this.returnValue;
      } else {
        this.$emit('update:returnValue', this.originalValue);
      }
    }
  },

  methods: {
    save: function save(value) {
      this.originalValue = value;
      this.isActive = false;
    }
  }
};