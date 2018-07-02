'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _VTabsItems = require('../VTabsItems');

var _VTabsItems2 = _interopRequireDefault(_VTabsItems);

var _VTabsSlider = require('../VTabsSlider');

var _VTabsSlider2 = _interopRequireDefault(_VTabsSlider);

var _VIcon = require('../../VIcon');

var _VIcon2 = _interopRequireDefault(_VIcon);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Tabs generators
 *
 * @mixin
 */
exports.default = {
  methods: {
    genBar: function genBar(items) {
      return this.$createElement('div', {
        staticClass: 'tabs__bar',
        'class': this.addBackgroundColorClassChecks({
          'theme--dark': this.dark,
          'theme--light': this.light
        }),
        ref: 'bar'
      }, [this.genTransition('prev'), this.genWrapper(this.genContainer(items)), this.genTransition('next')]);
    },
    genContainer: function genContainer(items) {
      return this.$createElement('div', {
        staticClass: 'tabs__container',
        class: {
          'tabs__container--align-with-title': this.alignWithTitle,
          'tabs__container--centered': this.centered,
          'tabs__container--fixed-tabs': this.fixedTabs,
          'tabs__container--grow': this.grow,
          'tabs__container--icons-and-text': this.iconsAndText,
          'tabs__container--overflow': this.isOverflowing,
          'tabs__container--right': this.right
        },
        style: this.containerStyles,
        ref: 'container'
      }, items);
    },
    genIcon: function genIcon(direction) {
      var _this = this;

      if (!this.hasArrows || !this[direction + 'IconVisible']) return null;

      return this.$createElement(_VIcon2.default, {
        staticClass: 'tabs__icon tabs__icon--' + direction,
        props: {
          disabled: !this[direction + 'IconVisible']
        },
        on: {
          click: function click() {
            return _this.scrollTo(direction);
          }
        }
      }, this[direction + 'Icon']);
    },
    genItems: function genItems(items, item) {
      if (items.length > 0) return items;
      if (!item.length) return null;

      return this.$createElement(_VTabsItems2.default, item);
    },
    genTransition: function genTransition(direction) {
      return this.$createElement('transition', {
        props: { name: 'fade-transition' }
      }, [this.genIcon(direction)]);
    },
    genWrapper: function genWrapper(items) {
      var _this2 = this;

      return this.$createElement('div', {
        staticClass: 'tabs__wrapper',
        class: {
          'tabs__wrapper--show-arrows': this.hasArrows
        },
        ref: 'wrapper',
        directives: [{
          name: 'touch',
          value: {
            start: function start(e) {
              return _this2.overflowCheck(e, _this2.onTouchStart);
            },
            move: function move(e) {
              return _this2.overflowCheck(e, _this2.onTouchMove);
            },
            end: function end(e) {
              return _this2.overflowCheck(e, _this2.onTouchEnd);
            }
          }
        }]
      }, [items]);
    },
    genSlider: function genSlider(items) {
      if (!items.length) {
        items = [this.$createElement(_VTabsSlider2.default, {
          props: { color: this.sliderColor }
        })];
      }

      return this.$createElement('div', {
        staticClass: 'tabs__slider-wrapper',
        style: this.sliderStyles
      }, items);
    }
  }
};