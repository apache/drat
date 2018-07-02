'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; // Styles


// Mixins


// Component level mixins


// Directives


require('../../../src/stylus/components/_text-fields.styl');

require('../../../src/stylus/components/_input-groups.styl');

require('../../../src/stylus/components/_select.styl');

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _dependent = require('../../mixins/dependent');

var _dependent2 = _interopRequireDefault(_dependent);

var _filterable = require('../../mixins/filterable');

var _filterable2 = _interopRequireDefault(_filterable);

var _input = require('../../mixins/input');

var _input2 = _interopRequireDefault(_input);

var _maskable = require('../../mixins/maskable');

var _maskable2 = _interopRequireDefault(_maskable);

var _soloable = require('../../mixins/soloable');

var _soloable2 = _interopRequireDefault(_soloable);

var _selectAutocomplete = require('./mixins/select-autocomplete');

var _selectAutocomplete2 = _interopRequireDefault(_selectAutocomplete);

var _selectComputed = require('./mixins/select-computed');

var _selectComputed2 = _interopRequireDefault(_selectComputed);

var _selectEvents = require('./mixins/select-events');

var _selectEvents2 = _interopRequireDefault(_selectEvents);

var _selectGenerators = require('./mixins/select-generators');

var _selectGenerators2 = _interopRequireDefault(_selectGenerators);

var _selectHelpers = require('./mixins/select-helpers');

var _selectHelpers2 = _interopRequireDefault(_selectHelpers);

var _selectMenu = require('./mixins/select-menu');

var _selectMenu2 = _interopRequireDefault(_selectMenu);

var _selectProps = require('./mixins/select-props');

var _selectProps2 = _interopRequireDefault(_selectProps);

var _selectWatchers = require('./mixins/select-watchers');

var _selectWatchers2 = _interopRequireDefault(_selectWatchers);

var _clickOutside = require('../../directives/click-outside');

var _clickOutside2 = _interopRequireDefault(_clickOutside);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-select',

  inheritAttrs: false,

  directives: {
    ClickOutside: _clickOutside2.default
  },

  mixins: [_selectAutocomplete2.default, _colorable2.default, _dependent2.default, _selectEvents2.default, _filterable2.default, _selectGenerators2.default, _selectHelpers2.default, _input2.default, _maskable2.default, _selectMenu2.default, _selectProps2.default, _soloable2.default, _selectWatchers2.default,
  // Input and Computed both
  // contain isDirty props
  // last gets merged in
  _selectComputed2.default],

  data: function data() {
    return {
      cachedItems: this.cacheItems ? this.items : [],
      content: {},
      defaultColor: 'primary',
      inputValue: (this.multiple || this.tags) && !this.value ? [] : this.value,
      isBooted: false,
      lastItem: 20,
      lazySearch: null,
      isActive: false,
      menuIsActive: false,
      selectedIndex: -1,
      selectedItems: [],
      shouldBreak: false
    };
  },
  mounted: function mounted() {
    // If instance is being destroyed
    // do not run mounted functions
    if (this._isDestroyed) return;

    // Evaluate the selected items immediately
    // to avoid a unnecessary label transition
    this.genSelectedItems();

    this.content = this.$refs.menu.$refs.content;
  },
  beforeDestroy: function beforeDestroy() {
    if (this.isBooted) {
      if (this.content) {
        this.content.removeEventListener('scroll', this.onScroll, false);
      }
    }
  },


  methods: {
    needsTile: function needsTile(tile) {
      // TODO: use the component name instead of tag
      return tile.componentOptions == null || tile.componentOptions.tag !== 'v-list-tile';
    },
    changeSelectedIndex: function changeSelectedIndex(keyCode) {
      // backspace, left, right, delete
      if (![8, 37, 39, 46].includes(keyCode)) return;

      var indexes = this.selectedItems.length - 1;

      if (keyCode === 37) {
        // Left arrow
        this.selectedIndex = this.selectedIndex === -1 ? indexes : this.selectedIndex - 1;
      } else if (keyCode === 39) {
        // Right arrow
        this.selectedIndex = this.selectedIndex >= indexes ? -1 : this.selectedIndex + 1;
      } else if (this.selectedIndex === -1) {
        this.selectedIndex = indexes;
        return;
      }

      // backspace/delete
      if ([8, 46].includes(keyCode)) {
        var newIndex = this.selectedIndex === indexes ? this.selectedIndex - 1 : this.selectedItems[this.selectedIndex + 1] ? this.selectedIndex : -1;

        this.combobox ? this.inputValue = null : this.selectItem(this.selectedItems[this.selectedIndex]);
        this.selectedIndex = newIndex;
      }
    },
    closeConditional: function closeConditional(e) {
      return this.isActive && !!this.content && !this.content.contains(e.target) && !!this.$el && !this.$el.contains(e.target);
    },
    filterDuplicates: function filterDuplicates(arr) {
      var uniqueValues = new Map();
      for (var index = 0; index < arr.length; ++index) {
        var item = arr[index];
        var val = this.getValue(item);

        !uniqueValues.has(val) && uniqueValues.set(val, item);
      }
      return Array.from(uniqueValues.values());
    },
    genDirectives: function genDirectives() {
      var _this = this;

      return [{
        name: 'click-outside',
        value: function value() {
          return _this.isActive = false;
        },
        args: {
          closeConditional: this.closeConditional
        }
      }];
    },
    genSelectedItems: function genSelectedItems() {
      var _this2 = this;

      var val = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : this.inputValue;

      // If we are using tags, don't filter results
      if (this.tags) return this.selectedItems = val;

      // Combobox is the single version
      // of a taggable select element
      if (this.combobox) return this.selectedItems = val != null ? [val] : [];

      var selectedItems = this.computedItems.filter(function (i) {
        if (!_this2.isMultiple) {
          return _this2.getValue(i) === _this2.getValue(val);
        } else {
          // Always return Boolean
          return _this2.findExistingIndex(i) > -1;
        }
      });

      if (!selectedItems.length && val != null && this.tags) {
        selectedItems = Array.isArray(val) ? val : [val];
      }

      this.selectedItems = selectedItems;
    },
    clearableCallback: function clearableCallback() {
      var _this3 = this;

      var inputValue = this.isMultiple ? [] : null;

      this.inputValue = inputValue;
      this.$emit('change', inputValue);
      this.genSelectedItems();

      // When input is cleared
      // reset search value and
      // re-focus the input
      setTimeout(function () {
        _this3.searchValue = null;
        _this3.focusInput();
      }, 0);

      if (this.openOnClear) {
        setTimeout(this.showMenu, 50);
      }
    },
    onScroll: function onScroll() {
      var _this4 = this;

      if (!this.isActive) {
        requestAnimationFrame(function () {
          return _this4.content.scrollTop = 0;
        });
      } else {
        if (this.lastItem >= this.computedItems.length) return;

        var showMoreItems = this.content.scrollHeight - (this.content.scrollTop + this.content.clientHeight) < 200;

        if (showMoreItems) {
          this.lastItem += 20;
        }
      }
    },
    findExistingItem: function findExistingItem(val) {
      var _this5 = this;

      var itemValue = this.getValue(val);
      return this.items.find(function (i) {
        return _this5.valueComparator(_this5.getValue(i), itemValue);
      });
    },
    findExistingIndex: function findExistingIndex(item) {
      var _this6 = this;

      var itemValue = this.getValue(item);
      return this.inputValue.findIndex(function (i) {
        return _this6.valueComparator(_this6.getValue(i), itemValue);
      });
    },
    selectItem: function selectItem(item) {
      var _this7 = this;

      if (!this.isMultiple) {
        this.inputValue = this.returnObject ? item : this.getValue(item);
        this.selectedItems = [item];
      } else {
        var selectedItems = [];
        var inputValue = this.inputValue.slice();
        var i = this.findExistingIndex(item);

        i !== -1 ? inputValue.splice(i, 1) : inputValue.push(item);
        this.inputValue = inputValue.map(function (i) {
          selectedItems.push(i);
          return _this7.returnObject ? i : _this7.getValue(i);
        });

        this.selectedItems = selectedItems;
        this.selectedIndex = -1;
      }

      this.searchValue = !this.isMultiple && !this.chips && !this.$scopedSlots.selection ? this.getText(this.selectedItem) : null;

      this.$emit('change', this.inputValue);

      // List tile will re-render, reset index to
      // maintain highlighting
      var savedIndex = this.getMenuIndex();
      this.resetMenuIndex();

      // After selecting an item
      // refocus the input and
      // reset the caret pos
      this.$nextTick(function () {
        _this7.focusInput();
        _this7.setCaretPosition(_this7.currentRange);

        requestAnimationFrame(function () {
          if (savedIndex > -1) {
            _this7.setMenuIndex(savedIndex);
          }
        });
      });
    }
  },

  render: function render(h) {
    var _this8 = this;

    var data = {
      attrs: _extends({
        tabindex: this.isAutocomplete || this.disabled ? -1 : this.tabindex,
        'data-uid': this._uid
      }, this.isAutocomplete ? null : this.$attrs, {
        role: this.isAutocomplete ? null : 'combobox'
      })
    };

    if (!this.isAutocomplete) {
      data.on = this.genListeners();
      data.directives = this.genDirectives();
    } else {
      data.on = {
        click: function click() {
          if (_this8.disabled || _this8.readonly || _this8.isFocused) return;

          // If the input is dirty,
          // the input is not targetable
          // so we must manually focus
          if (_this8.isDirty) {
            _this8.focus();
            _this8.$nextTick(_this8.focusInput);
          }
        }
      };
    }

    return this.genInputGroup([this.genSelectionsAndSearch(), this.genMenu()], data, this.toggleMenu);
  }
};