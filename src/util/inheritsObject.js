var inherits = require('./inherits');

//make sure the aClass.prototype hook to the aObject instance.
module.exports = function(aObject, aClass) {
  // ES6: Object.getPrototypeOf / Object.setPrototypeOf
  var vOldProto = aObject.__proto__;
  var result = false;
  if ( vOldProto !== aClass.prototype) {
    inherits(aClass, vOldProto.constructor);
    aObject.__proto__ = aClass.prototype;
    result = true;
  }
  return result;
}

