'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _transitions = require('../transitions');

var _bootable = require('../../mixins/bootable');

var _bootable2 = _interopRequireDefault(_bootable);

var _toggleable = require('../../mixins/toggleable');

var _toggleable2 = _interopRequireDefault(_toggleable);

var _rippleable = require('../../mixins/rippleable');

var _rippleable2 = _interopRequireDefault(_rippleable);

var _registrable = require('../../mixins/registrable');

var _VIcon = require('../VIcon');

var _VIcon2 = _interopRequireDefault(_VIcon);

var _clickOutside = require('../../directives/click-outside');

var _clickOutside2 = _interopRequireDefault(_clickOutside);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-expansion-panel-content',

  mixins: [_bootable2.default, _toggleable2.default, _rippleable2.default, (0, _registrable.inject)('expansionPanel', 'v-expansion-panel', 'v-expansion-panel-content')],

  directives: {
    ClickOutside: _clickOutside2.default
  },

  inject: ['focusable', 'panelClick'],

  data: function data() {
    return {
      height: 'auto'
    };
  },


  props: {
    expandIcon: {
      type: String,
      default: 'keyboard_arrow_down'
    },
    hideActions: Boolean,
    ripple: {
      type: [Boolean, Object],
      default: false
    }
  },

  methods: {
    genBody: function genBody() {
      return this.$createElement('div', {
        ref: 'body',
        class: 'expansion-panel__body',
        directives: [{
          name: 'show',
          value: this.isActive
        }]
      }, this.showLazyContent(this.$slots.default));
    },
    genHeader: function genHeader() {
      var _this = this;

      return this.$createElement('div', {
        staticClass: 'expansion-panel__header',
        directives: [{
          name: 'ripple',
          value: this.ripple
        }],
        on: {
          click: function click() {
            return _this.panelClick(_this._uid);
          }
        }
      }, [this.$slots.header, this.genIcon()]);
    },
    genIcon: function genIcon(h) {
      if (this.hideActions) return null;

      var icon = this.$slots.actions || this.$createElement(_VIcon2.default, this.expandIcon);

      return this.$createElement('div', {
        staticClass: 'header__icon'
      }, [icon]);
    },
    toggle: function toggle(uid) {
      var _this2 = this;

      var isActive = this._uid === uid && !this.isActive;

      if (isActive) this.isBooted = true;

      // We treat bootable differently
      // Needs time to calc height
      this.$nextTick(function () {
        return _this2.isActive = isActive;
      });
    }
  },

  mounted: function mounted() {
    this.expansionPanel.register(this._uid, this.toggle);
  },
  beforeDestroy: function beforeDestroy() {
    this.expansionPanel.unregister(this._uid);
  },
  render: function render(h) {
    var _this3 = this;

    var children = [];

    this.$slots.header && children.push(this.genHeader());
    children.push(h(_transitions.VExpandTransition, [this.genBody()]));

    return h('li', {
      staticClass: 'expansion-panel__container',
      'class': {
        'expansion-panel__container--active': this.isActive
      },
      attrs: {
        tabindex: 0
      },
      on: {
        keydown: function keydown(e) {
          // Ensure element is focusable and the activeElement
          if (_this3.focusable && _this3.$el === document.activeElement && e.keyCode === 13) _this3.panelClick(_this3._uid);
        }
      }
    }, children);
  }
};