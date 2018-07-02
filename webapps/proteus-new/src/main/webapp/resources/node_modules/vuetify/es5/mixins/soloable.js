'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  name: 'soloable',

  props: {
    flat: Boolean,
    soloInverted: Boolean,
    solo: Boolean
  },

  computed: {
    isSolo: function isSolo() {
      return this.solo || this.soloInverted;
    }
  },

  methods: {
    genSoloClasses: function genSoloClasses() {
      return {
        'input-group--solo': this.isSolo,
        'input-group--solo-inverted': this.soloInverted,
        'elevation-0': this.flat
      };
    }
  }
};