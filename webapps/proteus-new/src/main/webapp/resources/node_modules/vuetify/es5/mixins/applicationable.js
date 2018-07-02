'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = applicationable;

var _positionable = require('./positionable');

function applicationable(value) {
  var events = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : [];

  return {
    name: 'applicationable',

    mixins: [(0, _positionable.factory)(['absolute', 'fixed'])],

    props: {
      app: Boolean
    },

    computed: {
      applicationProperty: function applicationProperty() {
        return value;
      }
    },

    watch: {
      // If previous value was app
      // reset the provided prop
      app: function app(x, prev) {
        prev ? this.removeApplication(true) : this.callUpdate();
      }
    },

    activated: function activated() {
      this.callUpdate();
    },
    created: function created() {
      for (var i = 0, length = events.length; i < length; i++) {
        this.$watch(events[i], this.callUpdate);
      }
      this.callUpdate();
    },
    mounted: function mounted() {
      this.callUpdate();
    },
    deactivated: function deactivated() {
      this.removeApplication();
    },
    destroyed: function destroyed() {
      this.removeApplication();
    },


    methods: {
      callUpdate: function callUpdate() {
        if (!this.app) return;

        this.$vuetify.application.bind(this._uid, this.applicationProperty, this.updateApplication());
      },
      removeApplication: function removeApplication(force) {
        if (!force && !this.app) return;

        this.$vuetify.application.unbind(this._uid, this.applicationProperty);
      },

      updateApplication: function updateApplication() {}
    }
  };
}