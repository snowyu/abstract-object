var extend          = require('./_extend');
var isInheritedFrom = require('./isInheritedFrom');
var newPrototype    = require('./newPrototype');

var getOwnPropertyNames = Object.getOwnPropertyNames;

/**
 *  Mixin multi classes to ctor.
 *  mixin(Class, ParentClass1, ParentClass2, ...)
 *  + __mixin_ctors__ array to keep the mixined super ctors
 *  + anonymous mixin_ctor hook to super_.
 *  inject into methods to implement inherit.
 *
 *  A11 -> A1 -> A -> Root
 *  B11 -> B1 -> B -> Root
 *  C11 -> C1 -> C -> Root
 *  mixin B11, C
 *  clone C.prototype to MixinCtor.prototype
 *  for k,method of C.prototype
 *    originalMethod = MixinCtor.prototype[k]
 *    if isFunction(originalMethod) and originalMethod.__mixin_prototype__
 *      #B11.__super__ is MixinCtor.prototype
 *      method  = ->
 *        B11.__super__ = originalMethod.__mixin_prototype__
 *        method.apply this, arguments
 *        B11.__super__ = MixinCtor
 *      method.__mixin_prototype__ = C.prototype
 *  B11 -> MixinCtor -> B1 -> B -> Root
 */

function mixin(ctor, superCtor) {
  var v  = ctor.super_;
  var result = false;
  if (!isInheritedFrom(ctor, superCtor)) {
    if (!ctor.mixinCtor_) ctor.mixinCtor_ = function(){};
    ctor.super_ = superCtor;
    ctor.__super__ = superCtor.prototype; //for coffeeScirpt super keyword.
    ctor.prototype = newPrototype(superCtor, ctor);
    while (v != null) {
      ctor = superCtor;
      ctor.super_ = superCtor;
      ctor.__super__ = superCtor.prototype; //for coffeeScirpt super keyword.
      ctor.prototype = newPrototype(superCtor, ctor);
      v = ctor.super_;
    }
    result = true;
  }
  return result;
}

module.exports = function(ctor) {
  for (var i = 1; i < arguments.length; i++) {
    var superCtor = arguments[i];
    if (!mixin(ctor, superCtor)) return false;
  }
  return true;
}
