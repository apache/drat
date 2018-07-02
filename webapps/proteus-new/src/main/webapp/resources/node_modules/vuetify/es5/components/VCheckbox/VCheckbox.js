'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_input-groups.styl');

require('../../../src/stylus/components/_selection-controls.styl');

var _VIcon = require('../VIcon');

var _VIcon2 = _interopRequireDefault(_VIcon);

var _transitions = require('../transitions');

var _rippleable = require('../../mixins/rippleable');

var _rippleable2 = _interopRequireDefault(_rippleable);

var _selectable = require('../../mixins/selectable');

var _selectable2 = _interopRequireDefault(_selectable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-checkbox',

  mixins: [_rippleable2.default, _selectable2.default],

  data: function data() {
    return {
      inputIndeterminate: this.indeterminate
    };
  },


  props: {
    indeterminate: Boolean
  },

  computed: {
    classes: function classes() {
      var classes = {
        'checkbox': true,
        'input-group--selection-controls': true,
        'input-group--active': this.isActive
      };

      if (this.hasError) {
        classes['error--text'] = true;
      } else {
        return this.addTextColorClassChecks(classes);
      }

      return classes;
    },
    icon: function icon() {
      if (this.inputIndeterminate) {
        return 'indeterminate_check_box';
      } else if (this.isActive) {
        return 'check_box';
      } else {
        return 'check_box_outline_blank';
      }
    }
  },

  methods: {
    groupFocus: function groupFocus(e) {
      this.isFocused = true;
      this.$emit('focus', e);
    },
    groupBlur: function groupBlur(e) {
      this.isFocused = false;
      this.tabFocused = false;
      this.$emit('blur', this.inputValue);
    }
  },

  render: function render(h) {
    var transition = h(_transitions.VFadeTransition, [h(_VIcon2.default, {
      staticClass: 'icon--selection-control',
      'class': {
        'icon--checkbox': this.icon === 'check_box'
      },
      key: this.icon,
      on: Object.assign({
        click: this.toggle
      }, this.$listeners)
    }, this.icon)]);

    var data = {
      attrs: {
        tabindex: this.disabled ? -1 : this.internalTabIndex || this.tabindex,
        role: 'checkbox',
        'aria-checked': this.inputIndeterminate ? 'mixed' : this.isActive ? 'true' : 'false',
        'aria-label': this.label
      }
    };

    var ripple = this.ripple ? this.genRipple() : null;

    return this.genInputGroup([transition, ripple], data);
  }
};