'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

// Components


// Mixins


require('../../../src/stylus/components/_pickers.styl');

var _VCard = require('../VCard');

var _VCard2 = _interopRequireDefault(_VCard);

var _colorable = require('../../mixins/colorable');

var _colorable2 = _interopRequireDefault(_colorable);

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-picker',

  mixins: [_colorable2.default, _themeable2.default],

  data: function data() {
    return {
      defaultColor: 'primary'
    };
  },


  props: {
    fullWidth: Boolean,
    landscape: Boolean,
    transition: {
      type: String,
      default: 'fade-transition'
    },
    width: {
      type: [Number, String],
      default: 290,
      validator: function validator(value) {
        return parseInt(value, 10) > 0;
      }
    }
  },

  computed: {
    computedTitleColor: function computedTitleColor() {
      var darkTheme = this.dark || !this.light && this.$vuetify.dark;
      var defaultTitleColor = darkTheme ? null : this.computedColor;
      return this.color || defaultTitleColor;
    }
  },

  methods: {
    genTitle: function genTitle() {
      return this.$createElement('div', {
        staticClass: 'picker__title',
        'class': this.addBackgroundColorClassChecks({
          'picker__title--landscape': this.landscape
        }, this.computedTitleColor)
      }, this.$slots.title);
    },
    genBodyTransition: function genBodyTransition() {
      return this.$createElement('transition', {
        props: {
          name: this.transition
        }
      }, this.$slots.default);
    },
    genBody: function genBody() {
      return this.$createElement('div', {
        staticClass: 'picker__body',
        style: this.fullWidth ? undefined : {
          width: this.width + 'px'
        }
      }, [this.genBodyTransition()]);
    },
    genActions: function genActions() {
      return this.$createElement('div', {
        staticClass: 'picker__actions card__actions'
      }, this.$slots.actions);
    }
  },

  render: function render(h) {
    return h(_VCard2.default, {
      staticClass: 'picker',
      'class': _extends({
        'picker--landscape': this.landscape
      }, this.themeClasses)
    }, [this.$slots.title ? this.genTitle() : null, this.genBody(), this.$slots.actions ? this.genActions() : null]);
  }
};