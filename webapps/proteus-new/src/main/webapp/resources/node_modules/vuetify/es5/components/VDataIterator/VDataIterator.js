'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_data-iterator.styl');

var _dataIterable = require('../../mixins/data-iterable');

var _dataIterable2 = _interopRequireDefault(_dataIterable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-data-iterator',

  mixins: [_dataIterable2.default],

  inheritAttrs: false,

  props: {
    contentTag: {
      type: String,
      default: 'div'
    },
    contentProps: {
      type: Object,
      required: false
    },
    contentClass: {
      type: String,
      required: false
    }
  },

  computed: {
    classes: function classes() {
      return {
        'data-iterator': true,
        'data-iterator--select-all': this.selectAll !== false,
        'theme--dark': this.dark,
        'theme--light': this.light
      };
    }
  },

  methods: {
    genContent: function genContent() {
      var children = this.genItems();

      var data = {
        'class': this.contentClass,
        attrs: this.$attrs,
        on: this.$listeners,
        props: this.contentProps
      };

      return this.$createElement(this.contentTag, data, children);
    },
    genEmptyItems: function genEmptyItems(content) {
      return [this.$createElement('div', {
        'class': 'text-xs-center',
        style: 'width: 100%'
      }, content)];
    },
    genFilteredItems: function genFilteredItems() {
      if (!this.$scopedSlots.item) {
        return null;
      }

      var items = [];
      for (var index = 0, len = this.filteredItems.length; index < len; ++index) {
        var item = this.filteredItems[index];
        var props = this.createProps(item, index);
        items.push(this.$scopedSlots.item(props));
      }

      return items;
    },
    genFooter: function genFooter() {
      var children = [];

      if (this.$slots.footer) {
        children.push(this.$slots.footer);
      }

      if (!this.hideActions) {
        children.push(this.genActions());
      }

      if (!children.length) return null;
      return this.$createElement('div', children);
    }
  },

  created: function created() {
    this.initPagination();
  },
  render: function render(h) {
    return h('div', {
      'class': this.classes
    }, [this.genContent(), this.genFooter()]);
  }
};