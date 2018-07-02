'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('../../../src/stylus/components/_parallax.styl');

var _translatable = require('../../mixins/translatable');

var _translatable2 = _interopRequireDefault(_translatable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = {
  name: 'v-parallax',

  mixins: [_translatable2.default],

  data: function data() {
    return {
      isBooted: false
    };
  },


  props: {
    alt: String,
    height: {
      type: [String, Number],
      default: 500
    },
    src: String
  },

  computed: {
    styles: function styles() {
      return {
        display: 'block',
        opacity: this.isBooted ? 1 : 0,
        transform: 'translate(-50%, ' + this.parallax + 'px)'
      };
    }
  },

  watch: {
    parallax: function parallax() {
      this.isBooted = true;
    }
  },

  mounted: function mounted() {
    this.init();
  },


  methods: {
    init: function init() {
      var _this = this;

      if (!this.$refs.img) return;

      if (this.$refs.img.complete) {
        this.translate();
        this.listeners();
      } else {
        this.$refs.img.addEventListener('load', function () {
          _this.translate();
          _this.listeners();
        }, false);
      }
    },
    objHeight: function objHeight() {
      return this.$refs.img.naturalHeight;
    },
    elOffsetTop: function elOffsetTop() {
      return this.$el.offsetTop;
    }
  },

  render: function render(h) {
    var imgData = {
      staticClass: 'parallax__image',
      style: this.styles,
      attrs: {
        src: this.src
      },
      ref: 'img'
    };

    if (this.alt) imgData.attrs.alt = this.alt;

    var container = h('div', {
      staticClass: 'parallax__image-container'
    }, [h('img', imgData)]);

    var content = h('div', {
      staticClass: 'parallax__content'
    }, this.$slots.default);

    return h('div', {
      staticClass: 'parallax',
      style: {
        height: this.normalizedHeight + 'px'
      },
      on: this.$listeners
    }, [container, content]);
  }
};