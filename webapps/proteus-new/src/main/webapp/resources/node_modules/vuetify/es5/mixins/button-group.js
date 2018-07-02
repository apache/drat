'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _registrable = require('./registrable');

var _console = require('../util/console');

exports.default = {
  name: 'button-group',

  mixins: [(0, _registrable.provide)('buttonGroup')],

  data: function data() {
    return {
      buttons: [],
      listeners: [],
      isDestroying: false
    };
  },


  watch: {
    buttons: 'update'
  },

  methods: {
    getValue: function getValue(i) {
      if (this.buttons[i].value != null) {
        return this.buttons[i].value;
      }

      // Fix for testing, this should always be false in the browser
      if (this.buttons[i].$el.value != null && this.buttons[i].$el.value !== '') {
        return this.buttons[i].$el.value;
      }

      return i;
    },
    update: function update() {
      var selected = [];

      for (var i = 0; i < this.buttons.length; i++) {
        var elm = this.buttons[i].$el;
        var button = this.buttons[i];

        elm.removeAttribute('data-only-child');

        if (this.isSelected(i)) {
          !button.to && (button.isActive = true);
          selected.push(i);
        } else {
          !button.to && (button.isActive = false);
        }
      }

      if (selected.length === 1) {
        this.buttons[selected[0]].$el.setAttribute('data-only-child', true);
      }

      this.ensureMandatoryInvariant(selected.length > 0);
    },
    register: function register(button) {
      var index = this.buttons.length;
      this.buttons.push(button);
      this.listeners.push(this.updateValue.bind(this, index));
      button.$on('click', this.listeners[index]);
    },
    unregister: function unregister(buttonToUnregister) {
      // Basic cleanup if we're destroying
      if (this.isDestroying) {
        var index = this.buttons.indexOf(buttonToUnregister);
        if (index !== -1) {
          buttonToUnregister.$off('click', this.listeners[index]);
        }
        return;
      }

      this.redoRegistrations(buttonToUnregister);
    },
    redoRegistrations: function redoRegistrations(buttonToUnregister) {
      var selectedCount = 0;

      var buttons = [];
      for (var index = 0; index < this.buttons.length; ++index) {
        var button = this.buttons[index];
        if (button !== buttonToUnregister) {
          buttons.push(button);
          selectedCount += Boolean(this.isSelected(index));
        }

        button.$off('click', this.listeners[index]);
      }

      this.buttons = [];
      this.listeners = [];

      for (var _index = 0; _index < buttons.length; ++_index) {
        this.register(buttons[_index]);
      }

      this.ensureMandatoryInvariant(selectedCount > 0);
      this.updateAllValues && this.updateAllValues();
    },
    ensureMandatoryInvariant: function ensureMandatoryInvariant(hasSelectedAlready) {
      // Preserve the mandatory invariant by selecting the first tracked button, if needed

      if (!this.mandatory || hasSelectedAlready) return;

      if (!this.listeners.length) {
        (0, _console.consoleWarn)('There must be at least one v-btn child if the mandatory property is true.', this);
        return;
      }

      this.listeners[0]();
    }
  },

  mounted: function mounted() {
    this.update();
  },
  beforeDestroy: function beforeDestroy() {
    this.isDestroying = true;
  }
};