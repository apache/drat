'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function inserted(el, binding) {
  var callback = binding.value;
  var options = binding.options || { passive: true };

  window.addEventListener('resize', callback, options);
  el._onResize = {
    callback: callback,
    options: options
  };

  if (!binding.modifiers || !binding.modifiers.quiet) {
    callback();
  }
}

function unbind(el, binding) {
  var _el$_onResize = el._onResize,
      callback = _el$_onResize.callback,
      options = _el$_onResize.options;


  window.removeEventListener('resize', callback, options);
  delete el._onResize;
}

exports.default = {
  name: 'resize',
  inserted: inserted,
  unbind: unbind
};