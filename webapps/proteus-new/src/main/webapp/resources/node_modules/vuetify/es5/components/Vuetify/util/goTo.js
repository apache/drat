'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = goTo;

var _console = require('../../../util/console');

var _easingPatterns = require('../../../util/easing-patterns');

var easingPatterns = _interopRequireWildcard(_easingPatterns);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var defaults = {
  duration: 500,
  offset: 0,
  easing: 'easeInOutCubic'
};

function getDocumentHeight() {
  return Math.max(document.body.scrollHeight, document.documentElement.scrollHeight, document.body.offsetHeight, document.documentElement.offsetHeight, document.body.clientHeight, document.documentElement.clientHeight);
}

function getWindowHeight() {
  return window.innerHeight || (document.documentElement || document.body).clientHeight;
}

function isVueComponent(obj) {
  return obj != null && obj._isVue;
}

function getTargetLocation(target, settings) {
  var location = void 0;

  if (isVueComponent(target)) {
    target = target.$el;
  }

  if (target instanceof Element) {
    location = target.getBoundingClientRect().top + window.scrollY;
  } else if (typeof target === 'string') {
    location = document.querySelector(target).offsetTop;
  } else if (typeof target === 'number') {
    location = target;
  } else {
    return undefined;
  }

  return Math.round(Math.min(Math.max(location + settings.offset, 0), getDocumentHeight() - getWindowHeight()));
}

function goTo(target, options) {
  if (typeof window === 'undefined') return;

  var settings = Object.assign({}, defaults, options);

  var startTime = performance.now();
  var startLocation = window.pageYOffset;
  var targetLocation = getTargetLocation(target, settings);
  var distanceToScroll = targetLocation - startLocation;
  var easingFunction = typeof settings.easing === 'function' ? settings.easing : easingPatterns[settings.easing];

  if (isNaN(targetLocation)) {
    var type = target == null ? target : target.constructor.name;
    return (0, _console.consoleError)('Target must be a Selector/Number/DOMElement/VueComponent, received ' + type + ' instead.');
  }
  if (!easingFunction) return (0, _console.consoleError)('Easing function \'' + settings.easing + '\' not found.');

  function step(currentTime) {
    var progressPercentage = Math.min(1, (currentTime - startTime) / settings.duration);
    var targetPosition = Math.floor(startLocation + distanceToScroll * easingFunction(progressPercentage));

    window.scrollTo(0, targetPosition);

    if (Math.round(window.pageYOffset) === targetLocation || progressPercentage === 1) return;

    window.requestAnimationFrame(step);
  }

  window.requestAnimationFrame(step);
}