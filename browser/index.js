var swig = require('../lib/swig');

if (typeof define === 'function' && typeof define.amd === 'object') {
  define('swig', [], function () {
    return swig;
  });
} else {
  window.swig = swig;
}
