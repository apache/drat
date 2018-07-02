'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

exports.default = {
  name: 'colorable',

  props: {
    color: String
  },

  data: function data() {
    return {
      defaultColor: null
    };
  },


  computed: {
    computedColor: function computedColor() {
      return this.color || this.defaultColor;
    }
  },

  methods: {
    addBackgroundColorClassChecks: function addBackgroundColorClassChecks() {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.computedColor;

      var classes = Object.assign({}, obj);

      if (color) {
        classes[color] = true;
      }

      return classes;
    },
    addTextColorClassChecks: function addTextColorClassChecks() {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var color = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : this.computedColor;

      var classes = Object.assign({}, obj);

      if (color) {
        var _color$trim$split = color.trim().split(' '),
            _color$trim$split2 = _slicedToArray(_color$trim$split, 2),
            colorName = _color$trim$split2[0],
            colorModifier = _color$trim$split2[1];

        classes[colorName + '--text'] = true;
        colorModifier && (classes['text--' + colorModifier] = true);
      }

      return classes;
    }
  }
};