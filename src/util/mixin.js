var extend          = require('./_extend');
var inherits        = require('./inherits');
var isInheritedFrom = require('./isInheritedFrom');
var isFunction      = require('./isFunction');
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
 *
class Root
   m: -> console.log 'root'
class C
   m: ->
     console.log "c"
     super
class B
class B11
   m: -> 
     console.log 'b11'
     super

mixin B11, C
 *
 */


function mixin(ctor, superCtor) {
  function clonePrototype(dest, src) {
    var names = getOwnPropertyNames(src);
    for (var i = 1; i < names.length; i++ ) {
      var k = names[i];
      var method = src[k];
      var originalMethod = dest[k];
      if (isFunction(originalMethod) && originalMethod.__mixin_super__) {
        method = (function(origM, newM) {
          return function() {
            ctor.__super__ = origM.__mixin_super__;
            var result = newM.apply(this, arguments);
            ctor.__super__ = ctor.mixinCtor_;
            return result;
          }
        })(originalMethod, method);
      }
      if (isFunction(method)) method.__mixin_super__ = src;
      dest[k] = method;
    }
  }
  var v  = ctor.super_;
  var result = false;
  if (!isInheritedFrom(ctor, superCtor)) {
    var mixinCtor = ctor.mixinCtor_;
    var mixinCtors = ctor.mixinCtors_;
    if (!mixinCtor) {
      mixinCtor = ctor.mixinCtor_ = function _MixinCls_(){};
      if (v && !inherits(mixinCtor, v)) return false;
    }
    if (!mixinCtors) mixinCtors = ctor.mixinCtors_ = [];
    mixinCtors.push(superCtor);//quickly check in isInheritedFrom for mixin.
    clonePrototype(mixinCtor.prototype, superCtor.prototype);
    ctor.super_ = mixinCtor;
    ctor.__super__ = mixinCtor.prototype; //for coffeeScirpt super keyword.
    ctor.prototype = newPrototype(mixinCtor, ctor);
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
