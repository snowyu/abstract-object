module.exports = function(ctor, superCtor) {
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
}

