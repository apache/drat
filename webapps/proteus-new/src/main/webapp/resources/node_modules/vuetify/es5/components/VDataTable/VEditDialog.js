'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_small-dialog.styl');

var _returnable = require('../../mixins/returnable');

var _returnable2 = _interopRequireDefault(_returnable);

var _VBtn = require('../VBtn');

var _VBtn2 = _interopRequireDefault(_VBtn);

var _VMenu = require('../VMenu');

var _VMenu2 = _interopRequireDefault(_VMenu);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-edit-dialog',

  mixins: [_returnable2.default],

  data: function data() {
    return {
      isActive: false,
      isSaving: false
    };
  },


  props: {
    cancelText: {
      default: 'Cancel'
    },
    large: Boolean,
    lazy: Boolean,
    persistent: Boolean,
    saveText: {
      default: 'Save'
    },
    transition: {
      type: String,
      default: 'slide-x-reverse-transition'
    }
  },

  watch: {
    isActive: function isActive(val) {
      val && setTimeout(this.focus, 50); // Give DOM time to paint
    }
  },

  methods: {
    cancel: function cancel() {
      this.isActive = false;
    },
    focus: function focus() {
      var input = this.$refs.content.querySelector('input');
      input && input.focus();
    },
    genButton: function genButton(fn, text) {
      return this.$createElement(_VBtn2.default, {
        props: {
          flat: true,
          color: 'primary',
          light: true
        },
        on: { click: fn }
      }, text);
    },
    genActions: function genActions() {
      var _this = this;

      return this.$createElement('div', {
        'class': 'small-dialog__actions'
      }, [this.genButton(this.cancel, this.cancelText), this.genButton(function () {
        return _this.save(_this.returnValue);
      }, this.saveText)]);
    },
    genContent: function genContent() {
      var _this2 = this;

      return this.$createElement('div', {
        on: {
          keydown: function keydown(e) {
            var input = _this2.$refs.content.querySelector('input');
            e.keyCode === 27 && _this2.cancel();
            e.keyCode === 13 && input && _this2.save(input.value);
          }
        },
        ref: 'content'
      }, [this.$slots.input]);
    }
  },

  render: function render(h) {
    var _this3 = this;

    return h(_VMenu2.default, {
      'class': 'small-dialog',
      props: {
        contentClass: 'small-dialog__content',
        transition: this.transition,
        origin: 'top right',
        right: true,
        value: this.isActive,
        closeOnClick: !this.persistent,
        closeOnContentClick: false,
        lazy: this.lazy
      },
      on: {
        input: function input(val) {
          return _this3.isActive = val;
        }
      }
    }, [h('a', {
      slot: 'activator'
    }, this.$slots.default), this.genContent(), this.large ? this.genActions() : null]);
  }
};

// Mixins