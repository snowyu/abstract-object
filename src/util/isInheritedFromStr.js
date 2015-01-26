module.exports = function(ctor, superStr) {
  var result  =  ctor.super_ != null && ctor.super_.name === superStr;
  var checkeds = [];
  checkeds.push(ctor);
  while (!result && ((ctor = ctor.super_) != null)) {
    if (checkeds.indexOf(ctor) >= 0) {
      throw Error("Circular inherits found!");
    }
    checkeds.push(ctor);
    result = ctor.super_ != null && ctor.super_.name === superStr;
  }
  if (result) {
    result = ctor;
    ctor = checkeds[0];
    if (ctor.mixinCtor_ === result) result = ctor;
  }

  return result;
}

