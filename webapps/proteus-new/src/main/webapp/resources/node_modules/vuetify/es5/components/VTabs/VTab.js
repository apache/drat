'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _routable = require('../../mixins/routable');

var _routable2 = _interopRequireDefault(_routable);

var _registrable = require('../../mixins/registrable');

var _helpers = require('../../util/helpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } // Mixins


// Utilities


exports.default = {
  name: 'v-tab',

  mixins: [(0, _registrable.inject)('tabs', 'v-tab', 'v-tabs'), _routable2.default],

  inject: ['tabClick'],

  data: function data() {
    return {
      isActive: false
    };
  },


  props: {
    activeClass: {
      type: String,
      default: 'tabs__item--active'
    },
    ripple: {
      type: [Boolean, Object],
      default: true
    }
  },

  computed: {
    classes: function classes() {
      return _defineProperty({
        'tabs__item': true,
        'tabs__item--disabled': this.disabled
      }, this.activeClass, !this.to && this.isActive);
    },
    action: function action() {
      var to = this.to || this.href;

      if (this.$router && this.to === Object(this.to)) {
        var resolve = this.$router.resolve(this.to, this.$route, this.append);

        to = resolve.href;
      }

      return typeof to === 'string' ? to.replace('#', '') : this;
    }
  },

  watch: {
    $route: 'onRouteChange'
  },

  mounted: function mounted() {
    this.tabs.register(this);
    this.onRouteChange();
  },
  beforeDestroy: function beforeDestroy() {
    this.tabs.unregister(this);
  },


  methods: {
    click: function click(e) {
      // If user provides an
      // actual link, do not
      // prevent default
      if (this.href && this.href.indexOf('#') > -1) e.preventDefault();

      this.$emit('click', e);

      this.to || this.tabClick(this);
    },
    onRouteChange: function onRouteChange() {
      var _this = this;

      if (!this.to || !this.$refs.link) return;

      var path = '_vnode.data.class.' + this.activeClass;

      this.$nextTick(function () {
        if ((0, _helpers.getObjectValueByPath)(_this.$refs.link, path)) {
          _this.tabClick(_this);
        }
      });
    },
    toggle: function toggle(action) {
      this.isActive = action === this || action === this.action;
    }
  },

  render: function render(h) {
    var link = this.generateRouteLink();
    var data = link.data;

    // If disabled, use div as anchor tags do not support
    // being disabled

    var tag = this.disabled ? 'div' : link.tag;

    data.ref = 'link';

    return h('div', {
      staticClass: 'tabs__div'
    }, [h(tag, data, this.$slots.default)]);
  }
};