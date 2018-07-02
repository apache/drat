'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _expandTransition = require('../../transitions/expand-transition');

var _expandTransition2 = _interopRequireDefault(_expandTransition);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  methods: {
    genTBody: function genTBody() {
      var children = this.genItems();

      return this.$createElement('tbody', children);
    },
    genExpandedRow: function genExpandedRow(props) {
      var children = [];

      if (this.isExpanded(props.item)) {
        var expand = this.$createElement('div', {
          class: 'datatable__expand-content',
          key: props.item[this.itemKey]
        }, this.$scopedSlots.expand(props));

        children.push(expand);
      }

      var transition = this.$createElement('transition-group', {
        class: 'datatable__expand-col',
        attrs: { colspan: this.headerColumns },
        props: {
          tag: 'td'
        },
        on: (0, _expandTransition2.default)('datatable__expand-col--expanded')
      }, children);

      return this.genTR([transition], { class: 'datatable__expand-row' });
    },
    genFilteredItems: function genFilteredItems() {
      if (!this.$scopedSlots.items) {
        return null;
      }

      var rows = [];
      for (var index = 0, len = this.filteredItems.length; index < len; ++index) {
        var item = this.filteredItems[index];
        var props = this.createProps(item, index);
        var row = this.$scopedSlots.items(props);

        rows.push(this.hasTag(row, 'td') ? this.genTR(row, {
          key: index,
          attrs: { active: this.isSelected(item) }
        }) : row);

        if (this.$scopedSlots.expand) {
          var expandRow = this.genExpandedRow(props);
          rows.push(expandRow);
        }
      }

      return rows;
    },
    genEmptyItems: function genEmptyItems(content) {
      if (this.hasTag(content, 'tr')) {
        return content;
      } else if (this.hasTag(content, 'td')) {
        return this.genTR(content);
      } else {
        return this.genTR([this.$createElement('td', {
          class: {
            'text-xs-center': typeof content === 'string'
          },
          attrs: { colspan: this.headerColumns }
        }, content)]);
      }
    }
  }
};