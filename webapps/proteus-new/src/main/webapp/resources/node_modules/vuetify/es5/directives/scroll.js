'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function inserted(el, binding) {
  var callback = binding.value;
  var options = binding.options || { passive: true };
  var target = binding.arg || window;
  if (target === 'undefined') return;

  if (target !== window) {
    target = document.querySelector(target);
  }

  target.addEventListener('scroll', callback, options);

  el._onScroll = {
    callback: callback,
    options: options,
    target: target
  };
}

function unbind(el, binding) {
  if (!el._onScroll) return;

  var _el$_onScroll = el._onScroll,
      callback = _el$_onScroll.callback,
      options = _el$_onScroll.options,
      target = _el$_onScroll.target;


  target.removeEventListener('scroll', callback, options);
  delete el._onScroll;
}

exports.default = {
  name: 'scroll',
  inserted: inserted,
  unbind: unbind
};