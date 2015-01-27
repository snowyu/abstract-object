var isInheritedFrom = require('./isInheritedFrom');
var newPrototype = require('./newPrototype');
/**
 * Inherit the prototype methods from one constructor into another.
 *
 *
 * The Function.prototype.inherits from lang.js rewritten as a standalone
 * function (not on Function.prototype). NOTE: If this file is to be loaded
 * during bootstrapping this function needs to be rewritten using some native
 * functions as prototype setup using normal JavaScript does not work as
 * expected during bootstrapping (see mirror.js in r114903).
 *
 * @param {function} ctor Constructor function which needs to inherit the
 *     prototype.
 * @param {function} superCtor Constructor function to inherit prototype from.
 */
module.exports = function(ctor, superCtor) {
  var v  = ctor.super_;
  var mixinCtor = ctor.mixinCtor_;
  if (mixinCtor && v === mixinCtor) {
    ctor = mixinCtor;
    v = ctor.super_;
  }
  var result = false;
  if (!isInheritedFrom(ctor, superCtor)) {
    ctor.super_ = superCtor;
    ctor.__super__ = superCtor.prototype; //for coffeeScirpt super keyword.
    ctor.prototype = newPrototype(superCtor, ctor);
    while (v != null) {
      ctor = superCtor;
      superCtor = v;
      ctor.super_ = superCtor;
      ctor.__super__ = superCtor.prototype; //for coffeeScirpt super keyword.
      ctor.prototype = newPrototype(superCtor, ctor);
      v = ctor.super_;
    }
    result = true;
  }
  return result;
}

