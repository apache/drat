'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function () {
  var expandedParentClass = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

  return {
    enter: function enter(el, done) {
      el._parent = el.parentNode;

      (0, _helpers.addOnceEventListener)(el, 'transitionend', done);

      // Get height that is to be scrolled
      el.style.overflow = 'hidden';
      el.style.height = 0;
      el.style.display = 'block';
      expandedParentClass && el._parent.classList.add(expandedParentClass);

      setTimeout(function () {
        return el.style.height = el.scrollHeight + 'px';
      }, 100);
    },
    afterEnter: function afterEnter(el) {
      el.style.overflow = null;
      el.style.height = null;
    },
    leave: function leave(el, done) {
      // Remove initial transition
      (0, _helpers.addOnceEventListener)(el, 'transitionend', done);

      // Set height before we transition to 0
      el.style.overflow = 'hidden';
      el.style.height = el.offsetHeight + 'px';

      setTimeout(function () {
        return el.style.height = 0;
      }, 100);
    },
    afterLeave: function afterLeave(el) {
      expandedParentClass && el._parent && el._parent.classList.remove(expandedParentClass);
    }
  };
};

var _helpers = require('../../util/helpers');