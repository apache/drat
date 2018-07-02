'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_input-groups.styl');

require('../../../src/stylus/components/_selection-controls.styl');

require('../../../src/stylus/components/_radio-group.styl');

var _input = require('../../mixins/input');

var _input2 = _interopRequireDefault(_input);

var _registrable = require('../../mixins/registrable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mixins
exports.default = {
  name: 'v-radio-group',

  mixins: [_input2.default, (0, _registrable.provide)('radio')],

  model: {
    prop: 'inputValue',
    event: 'change'
  },

  provide: function provide() {
    var _this = this;

    return {
      isMandatory: function isMandatory() {
        return _this.mandatory;
      },
      name: function name() {
        return _this.name;
      }
    };
  },


  data: function data() {
    return {
      internalTabIndex: -1,
      radios: []
    };
  },

  props: {
    column: {
      type: Boolean,
      default: true
    },
    inputValue: null,
    mandatory: {
      type: Boolean,
      default: true
    },
    name: String,
    row: Boolean
  },

  watch: {
    hasError: function hasError(val) {
      for (var index = this.radios.length; --index >= 0;) {
        this.radios[index].parentError = val;
      }
    },
    inputValue: function inputValue(val) {
      for (var index = this.radios.length; --index >= 0;) {
        var radio = this.radios[index];
        radio.isActive = val === radio.value;
      }
    }
  },

  computed: {
    classes: function classes() {
      return {
        'radio-group': true,
        'radio-group--column': this.column && !this.row,
        'radio-group--row': this.row,
        'error--text': this.hasError
      };
    }
  },

  methods: {
    toggleRadio: function toggleRadio(value) {
      var _this2 = this;

      if (this.disabled) {
        return;
      }

      this.shouldValidate = true;
      this.$emit('change', value);
      this.$nextTick(function () {
        return _this2.validate();
      });

      for (var index = this.radios.length; --index >= 0;) {
        var radio = this.radios[index];
        if (radio.value !== value) radio.isActive = false;
      }
    },
    radioBlur: function radioBlur(e) {
      if (!e.relatedTarget || !e.relatedTarget.classList.contains('radio')) {
        this.shouldValidate = true;
        this.$emit('blur', this.inputValue);
      }
    },
    register: function register(radio) {
      radio.isActive = this.inputValue === radio.value;
      radio.$el.tabIndex = radio.$el.tabIndex > 0 ? radio.$el.tabIndex : 0;
      radio.$on('change', this.toggleRadio);
      radio.$on('blur', this.radioBlur);
      radio.$on('focus', this.radioFocus);
      this.radios.push(radio);
    },
    unregister: function unregister(radio) {
      radio.$off('change', this.toggleRadio);
      radio.$off('blur', this.radioBlur);
      radio.$off('focus', this.radioFocus);

      var index = this.radios.findIndex(function (r) {
        return r === radio;
      });

      if (index > -1) this.radios.splice(index, 1);
    }
  },

  render: function render(h) {
    var data = {
      attrs: {
        role: 'radiogroup'
      }
    };
    return this.genInputGroup(this.$slots.default, data);
  }
}; // Styles