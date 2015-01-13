var isObject = require('./isObject');
var objectToString = require('./objectToString');
var dateClass = '[object Date]';

module.exports = function(d) {
  return isObject(d) && objectToString(d) === dateClass;
}

