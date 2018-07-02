"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Select menu methods
 *
 * @mixin
 *
 * Menu based methods for
 * the v-select component
 */
exports.default = {
  methods: {
    activateInput: function activateInput() {
      this.isActive = true;
      this.isFocused = true;
    },
    deactivateInput: function deactivateInput() {
      this.isFocused = false;
      this.isActive = false;
      this.selectedIndex = -1;
    },
    hideMenu: function hideMenu() {
      this.menuIsActive = false;
    },
    showMenu: function showMenu() {
      this.activateInput();
      this.showMenuItems();
      this.isMultiple && this.resetMenuIndex();
    },
    showMenuItems: function showMenuItems() {
      this.menuIsActive = true;
    },
    toggleMenu: function toggleMenu() {
      if (this.disabled || this.readonly || this.menuIsVisible) return this.hideMenu();

      this.showMenu();
      this.focusInput();
    }
  }
};