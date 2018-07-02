'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _ripple = require('../directives/ripple');

var _ripple2 = _interopRequireDefault(_ripple);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

exports.default = {
  name: 'routable',

  directives: {
    Ripple: _ripple2.default
  },

  props: {
    activeClass: String,
    append: Boolean,
    disabled: Boolean,
    exact: {
      type: Boolean,
      default: undefined
    },
    exactActiveClass: String,
    href: [String, Object],
    to: [String, Object],
    nuxt: Boolean,
    replace: Boolean,
    ripple: [Boolean, Object],
    tag: String,
    target: String
  },

  methods: {
    click: function click() {},
    generateRouteLink: function generateRouteLink() {
      var exact = this.exact;
      var tag = void 0;

      var data = _defineProperty({
        attrs: { disabled: this.disabled },
        class: this.classes,
        props: {},
        directives: [{
          name: 'ripple',
          value: this.ripple && !this.disabled ? this.ripple : false
        }]
      }, this.to ? 'nativeOn' : 'on', _extends({}, this.$listeners, {
        click: this.click
      }));

      if (typeof this.exact === 'undefined') {
        exact = this.to === '/' || this.to === Object(this.to) && this.to.path === '/';
      }

      if (this.to) {
        // Add a special activeClass hook
        // for component level styles
        var activeClass = this.activeClass;
        var exactActiveClass = this.exactActiveClass || activeClass;

        if (this.proxyClass) {
          activeClass += ' ' + this.proxyClass;
          exactActiveClass += ' ' + this.proxyClass;
        }

        tag = this.nuxt ? 'nuxt-link' : 'router-link';
        Object.assign(data.props, {
          to: this.to,
          exact: exact,
          activeClass: activeClass,
          exactActiveClass: exactActiveClass,
          append: this.append,
          replace: this.replace
        });
      } else {
        tag = this.href && 'a' || this.tag || 'a';

        if (tag === 'a') {
          if (this.href) data.attrs.href = this.href;
          if (this.target) data.attrs.target = this.target;
        }
      }

      return { tag: tag, data: data };
    }
  }
};