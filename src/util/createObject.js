var arraySlice = Array.prototype.slice;

module.exports = function(aClass) {
  var result = new (Function.prototype.bind.apply(aClass, arguments));
  if (aClass !== aClass.prototype.constructor)
    aClass.prototype.constructor.apply(result, arraySlice.call(arguments, 1));
  return result;
}

