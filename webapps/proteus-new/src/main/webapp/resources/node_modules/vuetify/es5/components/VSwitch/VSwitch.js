'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_input-groups.styl');

require('../../../src/stylus/components/_selection-controls.styl');

require('../../../src/stylus/components/_switch.styl');

var _rippleable = require('../../mixins/rippleable');

var _rippleable2 = _interopRequireDefault(_rippleable);

var _selectable = require('../../mixins/selectable');

var _selectable2 = _interopRequireDefault(_selectable);

var _touch = require('../../directives/touch');

var _touch2 = _interopRequireDefault(_touch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-switch',

  mixins: [_rippleable2.default, _selectable2.default],

  directives: { Touch: _touch2.default },

  computed: {
    classes: function classes() {
      var classes = {
        'input-group--selection-controls switch': true
      };

      if (this.hasError) {
        classes['error--text'] = true;
      } else {
        return this.addTextColorClassChecks(classes);
      }

      return classes;
    },
    rippleClasses: function rippleClasses() {
      return {
        'input-group--selection-controls__ripple': true,
        'input-group--selection-controls__ripple--active': this.isActive
      };
    },
    containerClasses: function containerClasses() {
      return {
        'input-group--selection-controls__container': true,
        'input-group--selection-controls__container--light': this.light,
        'input-group--selection-controls__container--disabled': this.disabled
      };
    },
    toggleClasses: function toggleClasses() {
      return {
        'input-group--selection-controls__toggle': true,
        'input-group--selection-controls__toggle--active': this.isActive
      };
    }
  },

  methods: {
    onSwipeLeft: function onSwipeLeft() {
      if (this.isActive) this.toggle();
    },
    onSwipeRight: function onSwipeRight() {
      if (!this.isActive) this.toggle();
    }
  },

  render: function render(h) {
    var container = h('div', {
      'class': this.containerClasses
    }, [h('div', { 'class': this.toggleClasses }), this.genRipple({
      directives: [{
        name: 'touch',
        value: {
          left: this.onSwipeLeft,
          right: this.onSwipeRight
        }
      }]
    })]);

    return this.genInputGroup([container]);
  }
};

// Directives


// Mixins