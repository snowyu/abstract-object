var isMixinedFromStr = require('./isMixinedFromStr');
var isString = require('./isString');

module.exports = function(ctor, superCtor) {
  if (isString(superCtor)) return isMixinedFromStr(ctor, superCtor);
  var mixinCtors = ctor.mixinCtors_;
  var result = false;
  if (mixinCtors) {
    result = mixinCtors.indexOf(superCtor);
    result = result >= 0;
  }
  return result;
}

