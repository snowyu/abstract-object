module.exports = function(aClass, aArguments) {
  args = [aClass];
  if (aArguments)
    args = args.concat(Array.prototype.slice.call(aArguments));
  var result = new (Function.prototype.bind.apply(aClass, args));
  if (aClass !== aClass.prototype.constructor)
    aClass.prototype.constructor.apply(result, aArguments);
  return result;
}

