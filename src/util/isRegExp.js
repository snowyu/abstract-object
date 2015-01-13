var isObject = require('./isObject');
var objectToString = require('./objectToString');
var regexpClass = '[object RegExp]';

module.exports = function(v) {
  return isObject(v) && objectToString(v) === regexpClass;
}

