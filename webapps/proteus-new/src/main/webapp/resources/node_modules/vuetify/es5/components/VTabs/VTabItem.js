'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _bootable = require('../../mixins/bootable');

var _bootable2 = _interopRequireDefault(_bootable);

var _transitions = require('../transitions');

var _registrable = require('../../mixins/registrable');

var _touch = require('../../directives/touch');

var _touch2 = _interopRequireDefault(_touch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-tab-item',

  mixins: [_bootable2.default, (0, _registrable.inject)('tabs', 'v-tab-item', 'v-tabs-items')],

  components: {
    VTabTransition: _transitions.VTabTransition,
    VTabReverseTransition: _transitions.VTabReverseTransition
  },

  directives: {
    Touch: _touch2.default
  },

  data: function data() {
    return {
      isActive: false,
      reverse: false
    };
  },


  props: {
    id: String,
    transition: {
      type: [Boolean, String],
      default: 'tab-transition'
    },
    reverseTransition: {
      type: [Boolean, String],
      default: 'tab-reverse-transition'
    }
  },

  computed: {
    computedTransition: function computedTransition() {
      return this.reverse ? this.reverseTransition : this.transition;
    }
  },

  methods: {
    toggle: function toggle(target, reverse, showTransition, index) {
      this.$el.style.transition = !showTransition ? 'none' : null;
      this.reverse = reverse;
      this.isActive = (this.id || index.toString()) === target;
    }
  },

  mounted: function mounted() {
    this.tabs.register(this);
  },
  beforeDestroy: function beforeDestroy() {
    this.tabs.unregister(this);
  },
  render: function render(h) {
    var data = {
      staticClass: 'tabs__content',
      directives: [{
        name: 'show',
        value: this.isActive
      }],
      domProps: { id: this.id },
      on: this.$listeners
    };

    var div = h('div', data, this.showLazyContent(this.$slots.default));

    if (!this.computedTransition) return div;

    return h('transition', {
      props: { name: this.computedTransition }
    }, [div]);
  }
};