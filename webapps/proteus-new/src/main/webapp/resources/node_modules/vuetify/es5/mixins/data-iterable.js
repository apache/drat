'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _VBtn = require('../components/VBtn');

var _VBtn2 = _interopRequireDefault(_VBtn);

var _VIcon = require('../components/VIcon');

var _VIcon2 = _interopRequireDefault(_VIcon);

var _VSelect = require('../components/VSelect');

var _VSelect2 = _interopRequireDefault(_VSelect);

var _filterable = require('./filterable');

var _filterable2 = _interopRequireDefault(_filterable);

var _themeable = require('./themeable');

var _themeable2 = _interopRequireDefault(_themeable);

var _loadable = require('./loadable');

var _loadable2 = _interopRequireDefault(_loadable);

var _helpers = require('../util/helpers');

var _console = require('../util/console');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * DataIterable
 *
 * @mixin
 *
 * Base behavior for data table and data iterator
 * providing selection, pagination, sorting and filtering.
 *
 */
exports.default = {
  name: 'data-iterable',

  data: function data() {
    return {
      searchLength: 0,
      defaultPagination: {
        descending: false,
        page: 1,
        rowsPerPage: 5,
        sortBy: null,
        totalItems: 0
      },
      expanded: {},
      actionsClasses: 'data-iterator__actions',
      actionsRangeControlsClasses: 'data-iterator__actions__range-controls',
      actionsSelectClasses: 'data-iterator__actions__select',
      actionsPaginationClasses: 'data-iterator__actions__pagination'
    };
  },


  mixins: [_filterable2.default, _loadable2.default, _themeable2.default],

  props: {
    expand: Boolean,
    hideActions: Boolean,
    disableInitialSort: Boolean,
    mustSort: Boolean,
    noResultsText: {
      type: String,
      default: 'No matching records found'
    },
    nextIcon: {
      type: String,
      default: 'chevron_right'
    },
    prevIcon: {
      type: String,
      default: 'chevron_left'
    },
    rowsPerPageItems: {
      type: Array,
      default: function _default() {
        return [5, 10, 25, { text: 'All', value: -1 }];
      }
    },
    rowsPerPageText: {
      type: String,
      default: 'Items per page:'
    },
    selectAll: [Boolean, String],
    search: {
      required: false
    },
    filter: {
      type: Function,
      default: function _default(val, search) {
        return val != null && typeof val !== 'boolean' && val.toString().toLowerCase().indexOf(search) !== -1;
      }
    },
    customFilter: {
      type: Function,
      default: function _default(items, search, filter) {
        search = search.toString().toLowerCase();
        if (search.trim() === '') return items;

        return items.filter(function (i) {
          return Object.keys(i).some(function (j) {
            return filter(i[j], search);
          });
        });
      }
    },
    customSort: {
      type: Function,
      default: function _default(items, index, isDescending) {
        if (index === null) return items;

        return items.sort(function (a, b) {
          var sortA = (0, _helpers.getObjectValueByPath)(a, index);
          var sortB = (0, _helpers.getObjectValueByPath)(b, index);

          if (isDescending) {
            var _ref = [sortB, sortA];
            sortA = _ref[0];
            sortB = _ref[1];
          }

          // Check if both are numbers
          if (!isNaN(sortA) && !isNaN(sortB)) {
            return sortA - sortB;
          }

          // Check if both cannot be evaluated
          if (sortA === null && sortB === null) {
            return 0;
          }

          var _map = [sortA, sortB].map(function (s) {
            return (s || '').toString().toLocaleLowerCase();
          });

          var _map2 = _slicedToArray(_map, 2);

          sortA = _map2[0];
          sortB = _map2[1];


          if (sortA > sortB) return 1;
          if (sortA < sortB) return -1;

          return 0;
        });
      }
    },
    value: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    items: {
      type: Array,
      required: true,
      default: function _default() {
        return [];
      }
    },
    totalItems: {
      type: Number,
      default: null
    },
    itemKey: {
      type: String,
      default: 'id'
    },
    pagination: {
      type: Object,
      default: function _default() {}
    }
  },

  computed: {
    computedPagination: function computedPagination() {
      return this.hasPagination ? this.pagination : this.defaultPagination;
    },
    hasPagination: function hasPagination() {
      var pagination = this.pagination || {};

      return Object.keys(pagination).length > 0;
    },
    hasSelectAll: function hasSelectAll() {
      return this.selectAll !== undefined && this.selectAll !== false;
    },
    itemsLength: function itemsLength() {
      if (this.search) return this.searchLength;
      return this.totalItems || this.items.length;
    },
    indeterminate: function indeterminate() {
      return this.hasSelectAll && this.someItems && !this.everyItem;
    },
    everyItem: function everyItem() {
      var _this = this;

      return this.filteredItems.length && this.filteredItems.every(function (i) {
        return _this.isSelected(i);
      });
    },
    someItems: function someItems() {
      var _this2 = this;

      return this.filteredItems.some(function (i) {
        return _this2.isSelected(i);
      });
    },
    getPage: function getPage() {
      var rowsPerPage = this.computedPagination.rowsPerPage;


      return rowsPerPage === Object(rowsPerPage) ? rowsPerPage.value : rowsPerPage;
    },
    pageStart: function pageStart() {
      return this.getPage === -1 ? 0 : (this.computedPagination.page - 1) * this.getPage;
    },
    pageStop: function pageStop() {
      return this.getPage === -1 ? this.itemsLength : this.computedPagination.page * this.getPage;
    },
    filteredItems: function filteredItems() {
      return this.filteredItemsImpl();
    },
    selected: function selected() {
      var selected = {};
      for (var index = 0; index < this.value.length; index++) {
        selected[this.value[index][this.itemKey]] = true;
      }
      return selected;
    }
  },

  watch: {
    itemsLength: function itemsLength(totalItems) {
      this.updatePagination({ page: 1, totalItems: totalItems });
    }
  },

  methods: {
    initPagination: function initPagination() {
      if (!this.rowsPerPageItems.length) {
        (0, _console.consoleWarn)('The prop \'rows-per-page-items\' can not be empty', this);
      } else {
        this.defaultPagination.rowsPerPage = this.rowsPerPageItems[0];
      }

      this.defaultPagination.totalItems = this.itemsLength;

      this.updatePagination(Object.assign({}, this.defaultPagination, this.pagination));
    },
    updatePagination: function updatePagination(val) {
      var pagination = this.hasPagination ? this.pagination : this.defaultPagination;
      var updatedPagination = Object.assign({}, pagination, val);
      this.$emit('update:pagination', updatedPagination);

      if (!this.hasPagination) {
        this.defaultPagination = updatedPagination;
      }
    },
    isSelected: function isSelected(item) {
      return this.selected[item[this.itemKey]];
    },
    isExpanded: function isExpanded(item) {
      return this.expanded[item[this.itemKey]];
    },
    filteredItemsImpl: function filteredItemsImpl() {
      if (this.totalItems) return this.items;

      var items = this.items.slice();
      var hasSearch = typeof this.search !== 'undefined' && this.search !== null;

      if (hasSearch) {
        for (var _len = arguments.length, additionalFilterArgs = Array(_len), _key = 0; _key < _len; _key++) {
          additionalFilterArgs[_key] = arguments[_key];
        }

        items = this.customFilter.apply(this, [items, this.search, this.filter].concat(additionalFilterArgs));
        this.searchLength = items.length;
      }

      items = this.customSort(items, this.computedPagination.sortBy, this.computedPagination.descending);

      return this.hideActions && !this.hasPagination ? items : items.slice(this.pageStart, this.pageStop);
    },
    sort: function sort(index) {
      var _computedPagination = this.computedPagination,
          sortBy = _computedPagination.sortBy,
          descending = _computedPagination.descending;

      if (sortBy === null) {
        this.updatePagination({ sortBy: index, descending: false });
      } else if (sortBy === index && !descending) {
        this.updatePagination({ descending: true });
      } else if (sortBy !== index) {
        this.updatePagination({ sortBy: index, descending: false });
      } else if (!this.mustSort) {
        this.updatePagination({ sortBy: null, descending: null });
      } else {
        this.updatePagination({ sortBy: index, descending: false });
      }
    },
    toggle: function toggle(value) {
      var _this3 = this;

      var selected = Object.assign({}, this.selected);
      for (var index = 0; index < this.filteredItems.length; index++) {
        selected[this.filteredItems[index][this.itemKey]] = value;
      }

      this.$emit('input', this.items.filter(function (i) {
        return selected[i[_this3.itemKey]];
      }));
    },
    createProps: function createProps(item, index) {
      var _this4 = this;

      var props = { item: item, index: index };
      var keyProp = this.itemKey;
      var itemKey = item[keyProp];

      Object.defineProperty(props, 'selected', {
        get: function get() {
          return _this4.selected[item[_this4.itemKey]];
        },
        set: function set(value) {
          if (itemKey == null) {
            (0, _console.consoleWarn)('"' + keyProp + '" attribute must be defined for item', _this4);
          }

          var selected = _this4.value.slice();
          if (value) selected.push(item);else selected = selected.filter(function (i) {
            return i[keyProp] !== itemKey;
          });
          _this4.$emit('input', selected);
        }
      });

      Object.defineProperty(props, 'expanded', {
        get: function get() {
          return _this4.expanded[item[_this4.itemKey]];
        },
        set: function set(value) {
          if (itemKey == null) {
            (0, _console.consoleWarn)('"' + keyProp + '" attribute must be defined for item', _this4);
          }

          if (!_this4.expand) {
            for (var key in _this4.expanded) {
              _this4.expanded.hasOwnProperty(key) && _this4.$set(_this4.expanded, key, false);
            }
          }
          _this4.$set(_this4.expanded, itemKey, value);
        }
      });

      return props;
    },
    genItems: function genItems() {
      if (!this.itemsLength && !this.items.length) {
        var noData = this.$slots['no-data'] || this.noDataText;
        return [this.genEmptyItems(noData)];
      }

      if (!this.filteredItems.length) {
        var noResults = this.$slots['no-results'] || this.noResultsText;
        return [this.genEmptyItems(noResults)];
      }

      return this.genFilteredItems();
    },
    genPrevIcon: function genPrevIcon() {
      var _this5 = this;

      return this.$createElement(_VBtn2.default, {
        props: {
          disabled: this.computedPagination.page === 1,
          icon: true,
          flat: true,
          dark: this.dark,
          light: this.light
        },
        on: {
          click: function click() {
            var page = _this5.computedPagination.page;
            _this5.updatePagination({ page: page - 1 });
          }
        },
        attrs: {
          'aria-label': 'Previous page' // TODO: Localization
        }
      }, [this.$createElement(_VIcon2.default, this.prevIcon)]);
    },
    genNextIcon: function genNextIcon() {
      var _this6 = this;

      var pagination = this.computedPagination;
      var disabled = pagination.rowsPerPage < 0 || pagination.page * pagination.rowsPerPage >= this.itemsLength || this.pageStop < 0;

      return this.$createElement(_VBtn2.default, {
        props: {
          disabled: disabled,
          icon: true,
          flat: true,
          dark: this.dark,
          light: this.light
        },
        on: {
          click: function click() {
            var page = _this6.computedPagination.page;
            _this6.updatePagination({ page: page + 1 });
          }
        },
        attrs: {
          'aria-label': 'Next page' // TODO: Localization
        }
      }, [this.$createElement(_VIcon2.default, this.nextIcon)]);
    },
    genSelect: function genSelect() {
      var _this7 = this;

      return this.$createElement('div', {
        'class': this.actionsSelectClasses
      }, [this.rowsPerPageText, this.$createElement(_VSelect2.default, {
        attrs: {
          'aria-label': this.rowsPerPageText
        },
        props: {
          items: this.rowsPerPageItems,
          value: this.computedPagination.rowsPerPage,
          hideDetails: true,
          auto: true,
          minWidth: '75px'
        },
        on: {
          input: function input(val) {
            _this7.updatePagination({
              page: 1,
              rowsPerPage: val
            });
          }
        }
      })]);
    },
    genPagination: function genPagination() {
      var pagination = '–';

      if (this.itemsLength) {
        var stop = this.itemsLength < this.pageStop || this.pageStop < 0 ? this.itemsLength : this.pageStop;

        pagination = this.$scopedSlots.pageText ? this.$scopedSlots.pageText({
          pageStart: this.pageStart + 1,
          pageStop: stop,
          itemsLength: this.itemsLength
        }) : this.pageStart + 1 + '-' + stop + ' of ' + this.itemsLength;
      }

      return this.$createElement('div', {
        'class': this.actionsPaginationClasses
      }, [pagination]);
    },
    genActions: function genActions() {
      var rangeControls = this.$createElement('div', {
        'class': this.actionsRangeControlsClasses
      }, [this.genPagination(), this.genPrevIcon(), this.genNextIcon()]);

      return [this.$createElement('div', {
        'class': this.actionsClasses
      }, [this.rowsPerPageItems.length > 1 ? this.genSelect() : null, rangeControls])];
    }
  }
};