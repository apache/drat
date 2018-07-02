'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 * Select watchers
 *
 * @mixin
 *
 * Watchers for the
 * v-select component
 */
exports.default = {
  watch: {
    filteredItems: function filteredItems() {
      this.$refs.menu && this.$refs.menu.updateDimensions();
    },
    inputValue: function inputValue(val) {
      // Search for an existing item when a
      // value was selected from the menu
      if (this.combobox && this.isNotFiltering) {
        val = this.findExistingItem(val);
      }

      // Populate selected items
      this.genSelectedItems(val);

      // Only fire an update
      // if values do not
      // match
      val !== this.value && this.$emit('input', val);

      // When inputValue is changed
      // and combobox is true set
      // menu property to false
      if (this.combobox) this.menuIsActive = false;
    },
    isActive: function isActive(val) {
      if (val) {
        if (!this.chips && !this.$scopedSlots.selection) {
          this.searchValue = this.getText(this.selectedItem);
        }
        return;
      }

      this.blur();

      if (this.tags && this.searchValue) {
        this.updateTags(this.searchValue);
      }

      if (this.combobox && this.lazySearch && !this.isNotFiltering) {
        this.inputValue = this.lazySearch;
      }

      // Only set search value if
      // there is a value to set
      this.searchValue && (this.searchValue = null);
    },
    isBooted: function isBooted() {
      var _this = this;

      this.$nextTick(function () {
        if (_this.content && _this.content.addEventListener) {
          _this.content.addEventListener('scroll', _this.onScroll, false);
        }
      });
    },
    items: function items(val) {
      var _this2 = this;

      if (this.cacheItems) {
        this.cachedItems = this.filterDuplicates(this.cachedItems.concat(val));
      }

      this.resetMenuIndex();

      // Tags and combobox should not
      // pre-select the first entry
      if (this.searchValue && !this.isAnyValueAllowed) {
        this.$nextTick(function () {
          return _this2.setMenuIndex(0);
        });
      }

      this.genSelectedItems();
    },
    menuIsActive: function menuIsActive(val) {
      if (!val) return;

      this.isBooted = true;
    },
    isMultiple: function isMultiple(val) {
      this.inputValue = val ? [] : null;
    },
    searchInput: function searchInput(val) {
      this.searchValue = val;
    },
    searchValue: function searchValue(val, prev) {
      var _this3 = this;

      // Wrap input to next line if overflowing
      if (this.$refs.input.scrollWidth > this.$refs.input.clientWidth) {
        this.shouldBreak = true;
        this.$nextTick(this.$refs.menu.updateDimensions);
      } else if (val === null) {
        this.shouldBreak = false;
      }

      // Activate menu if inactive and searching
      if (this.isActive && !this.menuIsActive && val !== this.getText(this.selectedItem)) {
        this.menuIsActive = true;
      }

      // Only reset list index
      // if typing in search
      !val && prev && this.resetMenuIndex();

      this.$nextTick(function () {
        if (val && !_this3.isAnyValueAllowed) {
          _this3.setMenuIndex(0);
        }
        if (val !== null && _this3.selectedIndex > -1) {
          _this3.selectedIndex = -1;
        }
      });
    },
    selectedItems: function selectedItems() {
      if (this.isAutocomplete) {
        this.$nextTick(this.$refs.menu.updateDimensions);
      }
    },
    value: function value(val) {
      this.inputValue = val;
      this.validate();
    }
  }
};