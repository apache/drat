'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _helpers = require('../../../util/helpers');

/**
 * Select helpers
 *
 * @mixin
 *
 * Helper methods for the
 * v-select component
 */
exports.default = {
  methods: {
    getText: function getText(item) {
      return this.getPropertyFromItem(item, this.itemText);
    },
    getValue: function getValue(item) {
      return this.getPropertyFromItem(item, this.itemValue);
    },
    getPropertyFromItem: function getPropertyFromItem(item, field) {
      if (item !== Object(item)) return item;

      var value = (0, _helpers.getObjectValueByPath)(item, field);

      return typeof value === 'undefined' ? item : value;
    }
  }
}; // Helpers