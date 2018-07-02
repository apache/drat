'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_breadcrumbs.styl');

exports.default = {
  name: 'v-breadcrumbs',

  props: {
    divider: {
      type: String,
      default: '/'
    },
    large: Boolean,
    justifyCenter: Boolean,
    justifyEnd: Boolean
  },

  computed: {
    classes: function classes() {
      return {
        'breadcrumbs--large': this.large
      };
    },
    computedDivider: function computedDivider() {
      return this.$slots.divider ? this.$slots.divider : this.divider;
    },
    styles: function styles() {
      var justify = this.justifyCenter ? 'center' : this.justifyEnd ? 'flex-end' : 'flex-start';

      return {
        'justify-content': justify
      };
    }
  },

  methods: {
    /**
     * Add dividers between
     * v-breadcrumbs-item
     *
     * @return {array}
     */
    genChildren: function genChildren() {
      if (!this.$slots.default) return null;

      var h = this.$createElement;
      var children = [];
      var dividerData = { staticClass: 'breadcrumbs__divider' };

      var createDividers = false;
      for (var i = 0; i < this.$slots.default.length; i++) {
        var elm = this.$slots.default[i];

        if (!elm.componentOptions || elm.componentOptions.Ctor.options.name !== 'v-breadcrumbs-item') {
          children.push(elm);
        } else {
          if (createDividers) {
            children.push(h('li', dividerData, this.computedDivider));
          }
          children.push(elm);
          createDividers = true;
        }
      }

      return children;
    }
  },

  render: function render(h) {
    return h('ul', {
      staticClass: 'breadcrumbs',
      'class': this.classes,
      style: this.styles
    }, this.genChildren());
  }
};