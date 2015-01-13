var getConstructor = require('./getConstructor');
var isEmptyFunction = require('./isEmptyFunction');
var _extend = require('./_extend');

module.exports = function (aClass, aConstructor) {
      //Object.create(prototype) only for ES5
      //Object.create(prototype, initProps) only for ES6
      //For Browser not support ES5/6:
      //  var Object = function() { this.constructor = aConstructor; };
      //  Object.prototype = aClass.prototype;
      //  return new Object();
      var ctor = isEmptyFunction(aConstructor) ? getConstructor(aClass) : aConstructor;
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
      _extend(result, aConstructor.prototype);
      return result;
}
