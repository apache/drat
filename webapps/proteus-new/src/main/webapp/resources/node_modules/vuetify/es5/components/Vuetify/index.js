'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _application = require('./mixins/application');

var _application2 = _interopRequireDefault(_application);

var _theme = require('./mixins/theme');

var _theme2 = _interopRequireDefault(_theme);

var _options = require('./mixins/options');

var _options2 = _interopRequireDefault(_options);

var _console = require('../../util/console');

var _goTo = require('./util/goTo');

var _goTo2 = _interopRequireDefault(_goTo);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Vuetify = {
  install: function install(Vue) {
    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (this.installed) return;

    this.installed = true;

    checkVueVersion(Vue);

    Vue.prototype.$vuetify = new Vue({
      data: {
        application: _application2.default,
        breakpoint: {},
        dark: false,
        options: (0, _options2.default)(opts.options),
        theme: (0, _theme2.default)(opts.theme)
      },
      methods: {
        goTo: _goTo2.default
      }
    });

    if (opts.transitions) {
      Object.values(opts.transitions).forEach(function (transition) {
        if (transition.name !== undefined && transition.name.startsWith('v-')) {
          Vue.component(transition.name, transition);
        }
      });
    }

    if (opts.directives) {
      Object.values(opts.directives).forEach(function (directive) {
        Vue.directive(directive.name, directive);
      });
    }

    if (opts.components) {
      Object.values(opts.components).forEach(function (component) {
        Vue.use(component);
      });
    }
  }
};

/* istanbul ignore next */
function checkVueVersion(Vue) {
  var vueDep = '^2.5.0';

  var required = vueDep.split('.').map(function (v) {
    return v.replace(/\D/g, '');
  });
  var actual = Vue.version.split('.');

  // Simple semver caret range comparison
  var passes = actual[0] === required[0] && ( // major matches
  actual[1] > required[1] || // minor is greater
  actual[1] === required[1] && actual[2] >= required[2] // or minor is eq and patch is >=
  );

  if (!passes) {
    (0, _console.consoleWarn)('Vuetify requires Vue version ' + vueDep);
  }
}

exports.default = Vuetify;