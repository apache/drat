'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_tabs.styl');

var _tabsComputed = require('./mixins/tabs-computed');

var _tabsComputed2 = _interopRequireDefault(_tabsComputed);

var _tabsGenerators = require('./mixins/tabs-generators');

var _tabsGenerators2 = _interopRequireDefault(_tabsGenerators);

var _tabsProps = require('./mixins/tabs-props');

var _tabsProps2 = _interopRequireDefault(_tabsProps);

var _tabsTouch = require('./mixins/tabs-touch');

var _tabsTouch2 = _interopRequireDefault(_tabsTouch);

var _tabsWatchers = require('./mixins/tabs-watchers');

var _tabsWatchers2 = _interopRequireDefault(_tabsWatchers);

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _ssrBootable = require('../../mixins/ssr-bootable');

var _ssrBootable2 = _interopRequireDefault(_ssrBootable);

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

var _registrable = require('../../mixins/registrable');

var _resize = require('../../directives/resize');

var _resize2 = _interopRequireDefault(_resize);

var _touch = require('../../directives/touch');

var _touch2 = _interopRequireDefault(_touch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Directives


// Mixins
// Styles
exports.default = {
  name: 'v-tabs',

  mixins: [(0, _registrable.provide)('tabs'), _colorable2.default, _ssrBootable2.default, _tabsComputed2.default, _tabsProps2.default, _tabsGenerators2.default, _tabsTouch2.default, _tabsWatchers2.default, _themeable2.default],

  directives: {
    Resize: _resize2.default,
    Touch: _touch2.default
  },

  provide: function provide() {
    return {
      tabClick: this.tabClick,
      tabProxy: this.tabProxy,
      registerItems: this.registerItems,
      unregisterItems: this.unregisterItems
    };
  },
  data: function data() {
    return {
      bar: [],
      content: [],
      isBooted: false,
      isOverflowing: false,
      lazyValue: this.value,
      nextIconVisible: false,
      prevIconVisible: false,
      resizeTimeout: null,
      reverse: false,
      scrollOffset: 0,
      sliderWidth: null,
      sliderLeft: null,
      startX: 0,
      tabsContainer: null,
      tabs: [],
      tabItems: null,
      transitionTime: 300,
      widths: {
        bar: 0,
        container: 0,
        wrapper: 0
      }
    };
  },


  watch: {
    tabs: 'onResize'
  },

  mounted: function mounted() {
    this.checkIcons();
  },


  methods: {
    checkIcons: function checkIcons() {
      this.prevIconVisible = this.checkPrevIcon();
      this.nextIconVisible = this.checkNextIcon();
    },
    checkPrevIcon: function checkPrevIcon() {
      return this.scrollOffset > 0;
    },
    checkNextIcon: function checkNextIcon() {
      // Check one scroll ahead to know the width of right-most item
      return this.widths.container > this.scrollOffset + this.widths.wrapper;
    },
    callSlider: function callSlider() {
      var _this = this;

      if (this.hideSlider || !this.activeTab) return false;

      // Give screen time to paint
      var action = (this.activeTab || {}).action;
      var activeTab = action === this.activeTab ? this.activeTab : this.tabs.find(function (tab) {
        return tab.action === action;
      });

      this.$nextTick(function () {
        if (!activeTab || !activeTab.$el) return;
        _this.sliderWidth = activeTab.$el.scrollWidth;
        _this.sliderLeft = activeTab.$el.offsetLeft;
      });
    },

    /**
     * When v-navigation-drawer changes the
     * width of the container, call resize
     * after the transition is complete
     */
    onResize: function onResize() {
      var _this2 = this;

      if (this._isDestroyed) return;

      this.setWidths();

      clearTimeout(this.resizeTimeout);
      this.resizeTimeout = setTimeout(function () {
        _this2.callSlider();
        _this2.scrollIntoView();
        _this2.checkIcons();
      }, this.transitionTime);
    },
    overflowCheck: function overflowCheck(e, fn) {
      this.isOverflowing && fn(e);
    },
    scrollTo: function scrollTo(direction) {
      this.scrollOffset = this.newOffset(direction);
    },
    setOverflow: function setOverflow() {
      this.isOverflowing = this.widths.bar < this.widths.container;
    },
    setWidths: function setWidths() {
      var bar = this.$refs.bar ? this.$refs.bar.clientWidth : 0;
      var container = this.$refs.container ? this.$refs.container.clientWidth : 0;
      var wrapper = this.$refs.wrapper ? this.$refs.wrapper.clientWidth : 0;

      this.widths = { bar: bar, container: container, wrapper: wrapper };

      this.setOverflow();
    },
    findActiveLink: function findActiveLink() {
      var _this3 = this;

      if (!this.tabs.length || this.lazyValue) return;

      var activeIndex = this.tabs.findIndex(function (tabItem, index) {
        var id = tabItem.action === tabItem ? index.toString() : tabItem.action;
        return id === _this3.lazyValue || tabItem.$el.firstChild.className.indexOf(_this3.activeClass) > -1;
      });

      var index = activeIndex > -1 ? activeIndex : 0;
      var tab = this.tabs[index];

      /* istanbul ignore next */
      // There is not a reliable way to test
      this.inputValue = tab.action === tab ? index : tab.action;
    },
    parseNodes: function parseNodes() {
      var item = [];
      var items = [];
      var slider = [];
      var tab = [];
      var length = (this.$slots.default || []).length;

      for (var i = 0; i < length; i++) {
        var vnode = this.$slots.default[i];

        if (vnode.componentOptions) {
          switch (vnode.componentOptions.Ctor.options.name) {
            case 'v-tabs-slider':
              slider.push(vnode);
              break;
            case 'v-tabs-items':
              items.push(vnode);
              break;
            case 'v-tab-item':
              item.push(vnode);
              break;
            // case 'v-tab' - intentionally omitted
            default:
              tab.push(vnode);
          }
        } else {
          tab.push(vnode);
        }
      }

      return { tab: tab, slider: slider, items: items, item: item };
    },
    register: function register(options) {
      this.tabs.push(options);
    },
    scrollIntoView: function scrollIntoView() {
      if (!this.activeTab) return;
      if (!this.isOverflowing) return this.scrollOffset = 0;

      var totalWidth = this.widths.wrapper + this.scrollOffset;
      var _activeTab$$el = this.activeTab.$el,
          clientWidth = _activeTab$$el.clientWidth,
          offsetLeft = _activeTab$$el.offsetLeft;

      var itemOffset = clientWidth + offsetLeft;
      var additionalOffset = clientWidth * 0.3;

      /* istanbul ignore else */
      if (offsetLeft < this.scrollOffset) {
        this.scrollOffset = Math.max(offsetLeft - additionalOffset, 0);
      } else if (totalWidth < itemOffset) {
        this.scrollOffset -= totalWidth - itemOffset - additionalOffset;
      }
    },
    tabClick: function tabClick(tab) {
      this.inputValue = tab.action === tab ? this.tabs.indexOf(tab) : tab.action;
      this.scrollIntoView();
    },
    tabProxy: function tabProxy(val) {
      this.lazyValue = val;
    },
    registerItems: function registerItems(fn) {
      this.tabItems = fn;
    },
    unregisterItems: function unregisterItems() {
      this.tabItems = null;
    },
    unregister: function unregister(tab) {
      this.tabs = this.tabs.filter(function (o) {
        return o !== tab;
      });
    },
    updateTabs: function updateTabs() {
      for (var index = this.tabs.length; --index >= 0;) {
        this.tabs[index].toggle(this.target);
      }

      this.setOverflow();
    }
  },

  render: function render(h) {
    var _parseNodes = this.parseNodes(),
        tab = _parseNodes.tab,
        slider = _parseNodes.slider,
        items = _parseNodes.items,
        item = _parseNodes.item;

    return h('div', {
      staticClass: 'tabs',
      directives: [{
        name: 'resize',
        arg: 400,
        modifiers: { quiet: true },
        value: this.onResize
      }]
    }, [this.genBar([this.hideSlider ? null : this.genSlider(slider), tab]), this.genItems(items, item)]);
  }
};

// Component level mixins