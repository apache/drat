'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_lists.styl');

var _themeable = require('../../mixins/themeable');

var _themeable2 = _interopRequireDefault(_themeable);

var _registrable = require('../../mixins/registrable');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// Mixins
exports.default = {
  name: 'v-list',

  mixins: [(0, _registrable.provide)('list'), _themeable2.default],

  provide: function provide() {
    return {
      'listClick': this.listClick
    };
  },


  data: function data() {
    return {
      groups: []
    };
  },

  props: {
    dense: Boolean,
    expand: Boolean,
    subheader: Boolean,
    threeLine: Boolean,
    twoLine: Boolean
  },

  computed: {
    classes: function classes() {
      return {
        'list--dense': this.dense,
        'list--subheader': this.subheader,
        'list--two-line': this.twoLine,
        'list--three-line': this.threeLine,
        'theme--dark': this.dark,
        'theme--light': this.light
      };
    }
  },

  methods: {
    register: function register(uid, cb) {
      this.groups.push({ uid: uid, cb: cb });
    },
    unregister: function unregister(uid) {
      var index = this.groups.findIndex(function (g) {
        return g.uid === uid;
      });

      if (index > -1) {
        this.groups.splice(index, 1);
      }
    },
    listClick: function listClick(uid, isBooted) {
      if (this.expand) return;

      for (var i = this.groups.length; i--;) {
        this.groups[i].cb(uid);
      }
    }
  },

  render: function render(h) {
    var data = {
      staticClass: 'list',
      'class': this.classes
    };

    return h('div', data, [this.$slots.default]);
  }
}; // Styles