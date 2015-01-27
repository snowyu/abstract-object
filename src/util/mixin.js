var extend          = require('./_extend');
var inherits        = require('./inherits');
var inheritsDirectly= require('./inheritsDirectly');
var isInheritedFrom = require('./isInheritedFrom');
var isMixinedFrom   = require('./isMixinedFrom');
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


function isSuperInFunction(aMethod) {
  return isFunction(aMethod) && aMethod.__mixin_super__ && aMethod.toString().indexOf('__super__')>=0;
}

function mixin(ctor, superCtor) {
  function clonePrototype(dest, src) {
    var sp = src.prototype;
    var dp = dest.prototype;
    var names = getOwnPropertyNames(sp);
    for (var i = 1; i < names.length; i++ ) { //i = 1 to skip constructor property
      var k = names[i];
      var method = sp[k];
      var originalMethod = dp[k];
      if (isSuperInFunction(originalMethod) && sp !== originalMethod.__mixin_super__) {
        method = (function(origM, newM, src) {
          var oldSuper = src.__super__;
          return function() {
            src.__super__ = origM.__mixin_super__;
            var result = newM.apply(this, arguments);
            src.__super__ = oldSuper;
            return result;
          };
        })(originalMethod, method, src);
      }
      if (isFunction(method)) method.__mixin_super__ = sp;
      dp[k] = method;
    }
  }
  var v  = ctor.super_;
  var result = false;
  if (!isMixinedFrom(ctor, superCtor) && !isInheritedFrom(ctor, superCtor)) {
    var mixinCtor = ctor.mixinCtor_;
    var mixinCtors = ctor.mixinCtors_;
    if (!mixinCtor) {
      mixinCtor = ctor.mixinCtor_ = function MixinCtor_(){};
      if (v) inheritsDirectly(mixinCtor, v);
    }
    if (!mixinCtors) mixinCtors = ctor.mixinCtors_ = [];
    mixinCtors.push(superCtor);//quickly check in isMixinedFrom.
    clonePrototype(mixinCtor, superCtor);
    ctor.super_ = mixinCtor;
    ctor.__super__ = mixinCtor.prototype; //for coffeeScirpt super keyword.
    ctor.prototype = newPrototype(mixinCtor, ctor);
    result = true;
  }
  return result;
}

module.exports = function(ctor, superCtors, options) {
  if (isFunction(superCtors))
    return mixin(ctor, superCtors, options);
  for (var i = 0; i < superCtors.length; i++) {
    var superCtor = superCtors[i];
    if (!mixin(ctor, superCtor, options)) return false;
  }
  return true;
}
