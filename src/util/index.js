var util = module.exports = {
    objectToString: require('./objectToString'),

    isArray: Array.isArray,

    isBoolean: require('./isBoolean'),

    isNullOrUndefined: require('./isNullOrUndefined'),

    isString: require('./isString'),

    isNumber: require('./isNumber'),

    isUndefined: require('./isUndefined'),

    isObject: require('./isObject'),

    isFunction: require('./isFunction'),

    isDate: require('./isDate'),
    isRegExp: require('./isRegExp'),
    isArguments: require('./isArguments'),
    isEmpty: require('./isEmpty'),
    //just replace the ctor.super to superCtor,
    inheritsDirectly: require('./inheritsDirectly'),
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
    inherits: require('./inherits'),
    isInheritedFrom: require('./isInheritedFrom'),
    isInheritedFromStr: require('./isInheritedFromStr'),
    newPrototype: require('./newPrototype'),
    createObjectWith: require('./createObjectWith'),
    createObject: require('./createObject'),
    createObjectOld: function(aClass, aArguments) {
      function F() {
          return aClass.apply(this, aArguments);
      }
      F.prototype = aClass.prototype;
      return new F();
    },
    isEmptyFunction: require('./isEmptyFunction'),
    _extend: require('./_extend'),
    //make sure the aClass.prototype hook to the aObject instance.
    inheritsObject: require('./inheritsObject'),
    //get latest non-empty constructor function through inherits link:
    getConstructor: require('./getConstructor'),
    inject: require('./inject')
}
