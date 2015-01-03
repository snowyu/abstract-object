/** `Object#toString` result shortcuts */
var argsClass = '[object Arguments]',
    arrayClass = '[object Array]',
    boolClass = '[object Boolean]',
    dateClass = '[object Date]',
    errorClass = '[object Error]',
    funcClass = '[object Function]',
    numberClass = '[object Number]',
    objectClass = '[object Object]',
    regexpClass = '[object RegExp]',
    stringClass = '[object String]';
var support = {};
(function() {
  var ctor = function() { this.x = 1; },
      object = { '0': 1, 'length': 1 },
      props = [];

  ctor.prototype = { 'valueOf': 1, 'y': 1 };
  for (var key in new ctor) { props.push(key); }
  for (key in arguments) { }

  /**
   * Detect if an `arguments` object's [[Class]] is resolvable (all but Firefox < 4, IE < 9).
   *
   * @memberOf _.support
   * @type boolean
   */
  support.argsClass = toString.call(arguments) == argsClass;
}(1));
var hasOwnProperty = Object.prototype.hasOwnProperty;
var getOwnPropertyNames = Object.getOwnPropertyNames; //>=ECMAScript5 only

var util = module.exports = {
    objectToString: function(o) {
      return Object.prototype.toString.call(o);
    },

    isArray: Array.isArray,

    isBoolean: function(arg) {
      return typeof arg === 'boolean';
    },

    isNullOrUndefined: function(arg) {
      return arg == null;
    },

    isString: function(arg) {
      return typeof arg === 'string';
    },

    isNumber: function(arg) {
      return typeof arg === 'number';
    },

    isUndefined: function(arg) {
      return arg === void 0;
    },

    isObject: function(arg) {
      return arg != null && typeof arg === 'object';
    },

    isFunction: function(arg) {
      return typeof arg === 'function';
    },

    isDate: function(d) {
      return util.isObject(d) && util.objectToString(d) === '[object Date]';
    },
    isArguments: function(value) {
      return value && typeof value == 'object' && typeof value.length == 'number' &&
        toString.call(value) == argsClass || false;
    },
    isEmpty: function(value) {
      var result = true;
      if (!value) {
        return result;
      }
      var className = toString.call(value),
          length = value.length;

      if ((className == arrayClass || className == stringClass ||
          (support.argsClass ? className == argsClass : util.isArguments(value))) ||
          (className == objectClass && typeof length == 'number' && util.isFunction(value.splice))) {
        return !length;
      }

      if (className == funcClass) {
        return util.isEmptyFunction(value)
      }

      if (getOwnPropertyNames(value).length > 0) return false;
      /*
      for (var key in value) {
        if (hasOwnProperty.call(value, key)) return false;
      }
      */
      return result;
    },
    //just replace the ctor.super to superCtor,
    inheritsDirectly: function(ctor, superCtor) {
      ctor.super_ = superCtor;
      ctor.__super__ = superCtor.prototype; //for coffeeScirpt super keyword.
      ctor.prototype = util.newPrototype(superCtor, ctor);      
    },
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
    inherits: function(ctor, superCtor) {
      var v  = ctor.super_;
      var result = false;
      if (!util.isInheritedFrom(ctor, superCtor)) {
        ctor.super_ = superCtor;
        ctor.__super__ = superCtor.prototype; //for coffeeScirpt super keyword.
        ctor.prototype = util.newPrototype(superCtor, ctor);
        //result = util.inherits(superCtor, v);
        while (v != null) {
          ctor = superCtor;
          superCtor = v;
          ctor.super_ = superCtor;
          ctor.__super__ = superCtor.prototype; //for coffeeScirpt super keyword.
          ctor.prototype = util.newPrototype(superCtor, ctor);
          v = ctor.super_;
        }
        result = true;
      }
      return result;
    },
    isInheritedFrom: function(ctor, superCtor) {
      var result  = ctor.super_ === superCtor;
      var checkeds = [];
      var lastCtor = ctor;
      checkeds.push(ctor);
      while (!result && ((ctor = ctor.super_) != null)) {
        if (checkeds.indexOf(ctor) >= 0) {
          throw Error("Circular inherits found!");
        }
        checkeds.push(ctor);
        result = ctor.super_ === superCtor;
      }
      if (result) result = ctor;
      return result;
    },
    newPrototype: function(aClass, aConstructor) {
      //Object.create(prototype) only for ES5
      //Object.create(prototype, initProps) only for ES6
      //For Browser not support ES5/6:
      //  var Object = function() { this.constructor = aConstructor; };
      //  Object.prototype = aClass.prototype;
      //  return new Object();
      var ctor = util.isEmptyFunction(aConstructor) ? util.getConstructor(aClass) : aConstructor;
      var result;
      if (Object.create) { //typeof Object.create === 'function'
        result = Object.create(aClass.prototype, {
          constructor: {
            value: ctor,
            enumerable: false,
            writable: true,
            configurable: true
          }
        });
      } else {
        var Obj = function obj() {this.constructor = ctor};
        Obj.prototype = aClass.prototype;
        result = new Obj();
      }
      util._extend(result, aConstructor.prototype);
      return result;
    },
    createObjectWith: function(aClass, aArguments) {
      args = [aClass];
      if (aArguments)
        args = args.concat(Array.prototype.slice.call(aArguments));
      var result = new (Function.prototype.bind.apply(aClass, args));
      if (aClass !== aClass.prototype.constructor)
        aClass.prototype.constructor.apply(result, aArguments);
      return result;
    },
    createObject: function(aClass) {
      var result = new (Function.prototype.bind.apply(aClass, arguments));
      if (aClass !== aClass.prototype.constructor)
        aClass.prototype.constructor.apply(result, Array.prototype.slice.call(arguments, 1));
      return result;
    },
    createObjectOld: function(aClass, aArguments) {
      function F() {
          return aClass.apply(this, aArguments);
      }
      F.prototype = aClass.prototype;
      return new F();
    },
    isEmptyFunction: function(aFunc) {
      var result = /^function\s*\S*\s*\(.*\)\s*{[\s;]*}$/.test(aFunc.toString());
      return result;
    },
    _extend: function(origin, add) {
      // Don't do anything if add isn't an object
      if (!add || !util.isObject(add)) return origin;

      var keys = Object.keys(add);
      var i = keys.length;
      while (i--) {
        origin[keys[i]] = add[keys[i]];
      }
      return origin;
    },
    //make sure the aClass.prototype hook to the aObject instance.
    inheritsObject: function(aObject, aClass) {
      var vOldProto = aObject.__proto__;
      var result = false;
      if ( vOldProto !== aClass.prototype) {
        util.inherits(aClass, vOldProto.constructor);
        aObject.__proto__ = aClass.prototype;
        result = true;
      }
      return result;
    },
    //get latest non-empty constructor function through inherits link:
    getConstructor: function(ctor) {
      var result = ctor;
      var isEmpty = util.isEmptyFunction(result);
      while (isEmpty && (result.super_)) {
        result  = result.super_;
        isEmpty = util.isEmptyFunction(result);
      }
      //if (isEmpty) result = null;
      return result;
    },
    /*
    @desc  inject the function
    @param aOrgFunc     the original function to be injected.
    @param aBeforeExec  this is called before the execution of the aOrgFunc.
                        you must return the arguments(new Arguments(arguments))
                        if you wanna modify the arguments value of the aOrgFunc.
                        it will stop the execution of the aOrgFunc if you return
                        a value not an Arguments object nor a undefined value
    @param aAtferExec   this is called after the execution of the aOrgFunc.
                        you must add a result argument at the last argument of the
                        aAtferExec function if you wanna get the result value of the aOrgFunc.
                        you must add a isDenied argument following the result argument if you
                        wanna know whether the aOrgFunc is executed.
                        you must return the result if you wanna modify the result value of the aOrgFunc .

    @Usage  Obj.prototype.Method = inject(Obj.prototype.Method, aFunctionBeforeExec[, aFunctionAtferExec]);
    @version 1.1
    @author  Aimingoo&Riceball
    @history
      V1.0 -- first released.
      V1.1 --
        Supports to denie the aOrgFunc execution in aBeforeExec.
        Supports around in the aAtferExec, the aAtferExec be always executed even though
        denie the aOrgFunc execution in aBeforeExec.
          + isDenied argument to the aAtferExec function. notice the aAtferExec whether
            the aOrgFunc is executed

    eg:
    var doTest = function (a) {return a};
    function beforeTest(a) {
      alert('before exec: a='+a);
      a += 3;
      return arguments;
    };
    function afterTest(a, result, isDenied) {
      alert('after exec: a='+a+';result='+result+';isDenied='+isDenied);
      return result+5;
    };

    doTest = inject(doTest, beforeTest, afterTest);

    alert (doTest(2));
    the result should be 10.

  */
  inject: function ( aOrgFunc, aBeforeExec, aAtferExec ) {
    var arraySlice = Array.prototype.slice;
    return function() {
      var Result, isDenied=false, args=arraySlice.call(arguments);
      if (typeof(aBeforeExec) === 'function') {
        //the result
        //  * a return value instead of original function.
        //  * an arguments pass to original function.
        //  * whether deny the original function.
        //    * return the arguments to allow execution
        //    * return undefined to allow execution
        Result = aBeforeExec.apply(this, args);
        if (util.isArguments(Result)) {
          args = arraySlice.call(Result)
        }
        else if (isDenied = Result !== undefined)
          args.push(Result)
      }

      !isDenied && args.push(aOrgFunc.apply(this, args)); //if (!isDenied) args.push(aOrgFunc.apply(this, args));

      if (typeof(aAtferExec) === 'function') {
        Result = aAtferExec.apply(this, args.concat(isDenied));
      }
      else
        Result = undefined;

      return (Result !== undefined ? Result : args.pop());
    }
  }
}
