'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function searchChildren(children) {
  var results = [];
  for (var index = 0; index < children.length; index++) {
    var child = children[index];
    if (child.isActive && child.isDependent) {
      results.push(child);
    } else {
      results.push.apply(results, _toConsumableArray(searchChildren(child.$children)));
    }
  }

  return results;
}

exports.default = {
  name: 'dependent',

  data: function data() {
    return {
      closeDependents: true,
      isDependent: true
    };
  },


  methods: {
    getOpenDependents: function getOpenDependents() {
      if (this.closeDependents) return searchChildren(this.$children);

      return [];
    },
    getOpenDependentElements: function getOpenDependentElements() {
      var result = [];
      var openDependents = this.getOpenDependents();

      for (var index = 0; index < openDependents.length; index++) {
        result.push.apply(result, _toConsumableArray(openDependents[index].getClickableDependentElements()));
      }

      return result;
    },
    getClickableDependentElements: function getClickableDependentElements() {
      var result = [this.$el];
      if (this.$refs.content) result.push(this.$refs.content);
      result.push.apply(result, _toConsumableArray(this.getOpenDependentElements()));

      return result;
    }
  },

  watch: {
    isActive: function isActive(val) {
      if (val) return;

      var openDependents = this.getOpenDependents();
      for (var index = 0; index < openDependents.length; index++) {
        openDependents[index].isActive = false;
      }
    }
  }
};