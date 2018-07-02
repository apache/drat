'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_tables.styl');

require('../../../src/stylus/components/_data-table.styl');

var _dataIterable = require('../../mixins/data-iterable');

var _dataIterable2 = _interopRequireDefault(_dataIterable);

var _head = require('./mixins/head');

var _head2 = _interopRequireDefault(_head);

var _body = require('./mixins/body');

var _body2 = _interopRequireDefault(_body);

var _foot = require('./mixins/foot');

var _foot2 = _interopRequireDefault(_foot);

var _progress = require('./mixins/progress');

var _progress2 = _interopRequireDefault(_progress);

var _helpers = require('../../util/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Importing does not work properly
var VTableOverflow = (0, _helpers.createSimpleFunctional)('table__overflow');

exports.default = {
  name: 'v-data-table',

  data: function data() {
    return {
      actionsClasses: 'datatable__actions',
      actionsRangeControlsClasses: 'datatable__actions__range-controls',
      actionsSelectClasses: 'datatable__actions__select',
      actionsPaginationClasses: 'datatable__actions__pagination'
    };
  },


  mixins: [_dataIterable2.default, _head2.default, _body2.default, _foot2.default, _progress2.default],

  props: {
    headers: {
      type: Array,
      default: function _default() {
        return [];
      }
    },
    headerText: {
      type: String,
      default: 'text'
    },
    hideHeaders: Boolean,
    rowsPerPageText: {
      type: String,
      default: 'Rows per page:'
    },
    customFilter: {
      type: Function,
      default: function _default(items, search, filter, headers) {
        search = search.toString().toLowerCase();
        if (search.trim() === '') return items;

        var props = headers.map(function (h) {
          return h.value;
        });

        return items.filter(function (item) {
          return props.some(function (prop) {
            return filter((0, _helpers.getObjectValueByPath)(item, prop), search);
          });
        });
      }
    }
  },

  computed: {
    classes: function classes() {
      return {
        'datatable table': true,
        'datatable--select-all': this.selectAll !== false,
        'theme--dark': this.dark,
        'theme--light': this.light
      };
    },
    filteredItems: function filteredItems() {
      return this.filteredItemsImpl(this.headers);
    },
    headerColumns: function headerColumns() {
      return this.headers.length + (this.selectAll !== false);
    }
  },

  methods: {
    hasTag: function hasTag(elements, tag) {
      return Array.isArray(elements) && elements.find(function (e) {
        return e.tag === tag;
      });
    },
    genTR: function genTR(children) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

      return this.$createElement('tr', data, children);
    }
  },

  created: function created() {
    var firstSortable = this.headers.find(function (h) {
      return !('sortable' in h) || h.sortable;
    });

    this.defaultPagination.sortBy = !this.disableInitialSort && firstSortable ? firstSortable.value : null;

    this.initPagination();
  },
  render: function render(h) {
    var tableOverflow = h(VTableOverflow, {}, [h('table', {
      'class': this.classes
    }, [this.genTHead(), this.genTBody(), this.genTFoot()])]);

    return h('div', [tableOverflow, this.genActionsFooter()]);
  }
};