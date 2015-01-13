var newPrototype = require('./newPrototype');

//just replace the ctor.super to superCtor,
module.exports = function(ctor, superCtor) {
  ctor.super_ = superCtor;
  ctor.__super__ = superCtor.prototype; //for coffeeScirpt super keyword.
  ctor.prototype = newPrototype(superCtor, ctor);      
}

