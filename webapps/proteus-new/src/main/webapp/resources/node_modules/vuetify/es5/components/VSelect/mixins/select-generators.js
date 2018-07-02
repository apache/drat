'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _helpers = require('../../../util/helpers');

var _console = require('../../../util/console');

var _VBtn = require('../../VBtn');

var _VBtn2 = _interopRequireDefault(_VBtn);

var _VCard = require('../../VCard');

var _VCard2 = _interopRequireDefault(_VCard);

var _VCheckbox = require('../../VCheckbox');

var _VCheckbox2 = _interopRequireDefault(_VCheckbox);

var _VChip = require('../../VChip');

var _VChip2 = _interopRequireDefault(_VChip);

var _VDivider = require('../../VDivider');

var _VDivider2 = _interopRequireDefault(_VDivider);

var _VMenu = require('../../VMenu');

var _VMenu2 = _interopRequireDefault(_VMenu);

var _VSubheader = require('../../VSubheader');

var _VSubheader2 = _interopRequireDefault(_VSubheader);

var _VList = require('../../VList');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

// Components


/**
 * Select generators
 *
 * @mixin
 *
 * Used for creating the DOM elements for VSelect
 */
exports.default = {
  methods: {
    genMenu: function genMenu() {
      var _this = this;

      var data = {
        ref: 'menu',
        props: {
          activator: this.$el,
          auto: this.auto,
          attach: this.attach && '[data-uid="' + this._uid + '"]',
          closeOnClick: false,
          closeOnContentClick: !this.isMultiple,
          contentClass: this.computedContentClass,
          dark: this.dark,
          disabled: this.disabled,
          light: this.light,
          maxHeight: this.maxHeight,
          nudgeTop: this.nudgeTop,
          offsetY: this.shouldOffset,
          offsetOverflow: this.isAutocomplete,
          openOnClick: false,
          value: this.menuIsVisible,
          zIndex: this.menuZIndex
        },
        on: {
          input: function input(val) {
            if (!val) {
              _this.menuIsActive = false;
            }
          }
        }
      };

      if (this.isAutocomplete) data.props.transition = false;

      this.minWidth && (data.props.minWidth = this.minWidth);

      return this.$createElement(_VMenu2.default, data, [this.genList()]);
    },
    getMenuIndex: function getMenuIndex() {
      return this.$refs.menu ? this.$refs.menu.listIndex : -1;
    },
    setMenuIndex: function setMenuIndex(index) {
      this.$refs.menu && (this.$refs.menu.listIndex = index);
    },
    resetMenuIndex: function resetMenuIndex() {
      this.setMenuIndex(-1);
    },
    isMenuItemSelected: function isMenuItemSelected() {
      return this.menuIsActive && this.menuItems.length && this.getMenuIndex() > -1;
    },
    genSelectionsAndSearch: function genSelectionsAndSearch() {
      return this.$createElement('div', {
        'class': 'input-group__selections',
        style: { 'overflow': 'hidden' },
        ref: 'activator'
      }, [].concat(_toConsumableArray(this.genSelections()), [this.genSearch()]));
    },
    genSelections: function genSelections() {
      if (this.hideSelections) return [];

      var length = this.selectedItems.length;
      var children = new Array(length);

      var genSelection = void 0;
      if (this.$scopedSlots.selection) {
        genSelection = this.genSlotSelection;
      } else if (this.chips) {
        genSelection = this.genChipSelection;
      } else if (this.segmented) {
        genSelection = this.genSegmentedBtn;
      } else {
        genSelection = this.genCommaSelection;
      }

      while (length--) {
        children[length] = genSelection(this.selectedItems[length], length, length === children.length - 1);
      }

      return children;
    },
    genSearch: function genSearch() {
      var _this2 = this;

      var data = {
        staticClass: 'input-group--select__autocomplete',
        'class': {
          'input-group--select__autocomplete--index': this.selectedIndex > -1
        },
        style: {
          flex: this.shouldBreak ? '1 0 100%' : null
        },
        attrs: _extends({}, this.$attrs, {
          disabled: this.disabled || !this.isAutocomplete,
          readonly: this.readonly,
          tabindex: this.disabled || !this.isAutocomplete ? -1 : this.tabindex
        }),
        domProps: {
          value: this.maskText(this.lazySearch || '')
        },
        directives: [{
          name: 'show',
          value: this.isAutocomplete || this.placeholder && !this.selectedItems.length
        }],
        ref: 'input',
        key: 'input'
      };

      if (this.isAutocomplete) {
        data.attrs.role = 'combobox';
        data.domProps.autocomplete = this.browserAutocomplete;

        data.on = _extends({}, this.genListeners(), {
          input: function input(e) {
            if (_this2.selectedIndex > -1) return;

            _this2.searchValue = _this2.unmaskText(e.target.value);
          }
        });

        data.directives = data.directives.concat(this.genDirectives());
      }

      if (this.placeholder) data.domProps.placeholder = this.placeholder;

      return this.$createElement('input', data);
    },
    genSegmentedBtn: function genSegmentedBtn(item) {
      if (!item.text || !item.callback) {
        (0, _console.consoleWarn)('When using \'segmented\' prop without a selection slot, items must contain both a text and callback property', this);
        return null;
      }

      return this.$createElement(_VBtn2.default, {
        props: {
          flat: true
        },
        on: {
          click: function click(e) {
            e.stopPropagation();
            item.callback(e);
          }
        }
      }, [item.text]);
    },
    genSlotSelection: function genSlotSelection(item, index) {
      return this.$scopedSlots.selection({
        parent: this,
        item: item,
        index: index,
        selected: index === this.selectedIndex,
        disabled: this.disabled || this.readonly
      });
    },
    genChipSelection: function genChipSelection(item, index) {
      var _this3 = this;

      var isDisabled = this.disabled || this.readonly;
      var click = function click(e) {
        if (isDisabled) return;

        e.stopPropagation();
        _this3.focusInput();
        _this3.selectedIndex = index;
      };

      return this.$createElement(_VChip2.default, {
        staticClass: 'chip--select-multi',
        attrs: { tabindex: '-1' },
        props: {
          close: this.deletableChips && !isDisabled,
          dark: this.dark,
          disabled: isDisabled,
          selected: index === this.selectedIndex
        },
        on: {
          click: click,
          focus: click,
          input: function input() {
            if (_this3.isMultiple) _this3.selectItem(item);else _this3.inputValue = null;
          }
        },
        key: this.getValue(item)
      }, this.getText(item));
    },
    genCommaSelection: function genCommaSelection(item, index, last) {
      return this.$createElement('div', {
        staticClass: 'input-group__selections__comma',
        'class': {
          'input-group__selections__comma--active': index === this.selectedIndex
        },
        key: JSON.stringify(this.getValue(item)) // Item may be an object
      }, '' + this.getText(item) + (last ? '' : ', '));
    },
    genList: function genList() {
      var _this4 = this;

      var children = this.menuItems.map(function (o) {
        if (o.header) return _this4.genHeader(o);
        if (o.divider) return _this4.genDivider(o);else return _this4.genTile(o);
      });

      if (!children.length) {
        var noData = this.$slots['no-data'];
        if (noData) {
          children.push(noData);
        } else {
          children.push(this.genTile(this.noDataText, true));
        }
      }

      return this.$createElement(_VCard2.default, [this.$createElement(_VList.VList, {
        props: {
          dense: this.dense
        },
        ref: 'list'
      }, children)]);
    },
    genHeader: function genHeader(item) {
      return this.$createElement(_VSubheader2.default, {
        props: item
      }, item.header);
    },
    genDivider: function genDivider(item) {
      return this.$createElement(_VDivider2.default, {
        props: item
      });
    },
    genLabel: function genLabel() {
      var singleLine = this.singleLine || this.isDropdown;

      if (singleLine && (this.isDirty || this.isFocused && this.searchValue)) return null;

      var data = {};

      if (this.id) data.attrs = { for: this.id };

      return this.$createElement('label', data, this.$slots.label || this.label);
    },
    genTile: function genTile(item, disabled) {
      var _this5 = this;

      var active = this.selectedItems.indexOf(item) !== -1;

      if (typeof disabled === 'undefined') {
        disabled = (0, _helpers.getObjectValueByPath)(item, this.itemDisabled);
      }

      var data = {
        on: {
          click: function click(e) {
            if (disabled) return;

            _this5.selectItem(item);
          }
        },
        props: {
          avatar: item === Object(item) && this.itemAvatar in item,
          ripple: true,
          value: active
        }
      };

      if (disabled) {
        data.props.disabled = disabled;
      }

      data.props.activeClass = Object.keys(this.addTextColorClassChecks()).join(' ');

      if (this.$scopedSlots.item) {
        var tile = this.$scopedSlots.item({ parent: this, item: item, tile: data });
        return this.needsTile(tile) ? this.$createElement(_VList.VListTile, data, [tile]) : tile;
      }

      return this.$createElement(_VList.VListTile, data, [this.genAction(item, active), this.genContent(item)]);
    },
    genAction: function genAction(item, active) {
      var _this6 = this;

      if (!this.isMultiple || this.isHidingSelected) return null;

      var data = {
        staticClass: 'list__tile__action--select-multi',
        on: {
          click: function click(e) {
            e.stopPropagation();
            _this6.selectItem(item);
          }
        }
      };

      return this.$createElement(_VList.VListTileAction, data, [this.$createElement(_VCheckbox2.default, {
        props: {
          color: this.computedColor,
          inputValue: active
        }
      })]);
    },
    genContent: function genContent(item) {
      var text = this.getText(item);

      return this.$createElement(_VList.VListTileContent, [this.$createElement(_VList.VListTileTitle, {
        domProps: {
          innerHTML: this.genFiltered(text)
        }
      })]);
    }
  }
};