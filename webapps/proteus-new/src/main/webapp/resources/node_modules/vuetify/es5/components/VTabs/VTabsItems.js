'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _registrable = require('../../mixins/registrable');

var _touch = require('../../directives/touch');

var _touch2 = _interopRequireDefault(_touch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mixins
exports.default = {
  name: 'v-tabs-items',

  mixins: [(0, _registrable.provide)('tabs')],

  directives: { Touch: _touch2.default },

  inject: {
    registerItems: {
      default: null
    },
    tabProxy: {
      default: null
    },
    unregisterItems: {
      default: null
    }
  },

  data: function data() {
    return {
      items: [],
      lazyValue: this.value,
      reverse: false
    };
  },


  props: {
    cycle: Boolean,
    touchless: Boolean,
    value: [Number, String]
  },

  computed: {
    activeIndex: function activeIndex() {
      var _this = this;

      return this.items.findIndex(function (item, index) {
        return (item.id || index.toString()) === _this.lazyValue;
      });
    },
    activeItem: function activeItem() {
      if (!this.items.length) return undefined;

      return this.items[this.activeIndex];
    },

    inputValue: {
      get: function get() {
        return this.lazyValue;
      },
      set: function set(val) {
        val = val.toString();

        this.lazyValue = val;

        if (this.tabProxy) this.tabProxy(val);else this.$emit('input', val);
      }
    }
  },

  watch: {
    activeIndex: function activeIndex(current, previous) {
      this.reverse = current < previous;
      this.updateItems();
    },
    value: function value(val) {
      this.lazyValue = val;
    }
  },

  mounted: function mounted() {
    this.registerItems && this.registerItems(this.changeModel);
  },
  beforeDestroy: function beforeDestroy() {
    this.unregisterItems && this.unregisterItems();
  },


  methods: {
    changeModel: function changeModel(val) {
      this.inputValue = val;
    },
    next: function next(cycle) {
      var nextIndex = this.activeIndex + 1;

      if (!this.items[nextIndex]) {
        if (!cycle) return;
        nextIndex = 0;
      }

      this.inputValue = this.items[nextIndex].id || nextIndex;
    },
    prev: function prev(cycle) {
      var prevIndex = this.activeIndex - 1;

      if (!this.items[prevIndex]) {
        if (!cycle) return;
        prevIndex = this.items.length - 1;
      }

      this.inputValue = this.items[prevIndex].id || prevIndex;
    },
    onSwipe: function onSwipe(action) {
      this[action](this.cycle);
    },
    register: function register(item) {
      this.items.push(item);
    },
    unregister: function unregister(item) {
      this.items = this.items.filter(function (i) {
        return i !== item;
      });
    },
    updateItems: function updateItems() {
      for (var index = this.items.length; --index >= 0;) {
        this.items[index].toggle(this.lazyValue, this.reverse, this.isBooted, index);
      }
      this.isBooted = true;
    }
  },

  render: function render(h) {
    var _this2 = this;

    var data = {
      staticClass: 'tabs__items',
      directives: []
    };

    !this.touchless && data.directives.push({
      name: 'touch',
      value: {
        left: function left() {
          return _this2.onSwipe('next');
        },
        right: function right() {
          return _this2.onSwipe('prev');
        }
      }
    });

    return h('div', data, this.$slots.default);
  }
};

// Directives