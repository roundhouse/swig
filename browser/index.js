var swig = require('../lib/swig');

if (typeof define === 'function' && typeof define.amd === 'object') {
  define([], function () {
    return swig;
  });
} else {
  window.swig = swig;
}
