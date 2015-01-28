AbstractObject  = require("./Object")
inherits        = require("inherits-ex/lib/inherits")


# RefObject with RefCount and AddRef/Release Supports.
#
# * release/free: Decrements reference count for this instance. 
#   If it is becoming <0, the object would be (self) destroyed. 
# * addRef: Increments the reference count for this instance
#   and returns the new reference count.


module.exports = class RefObject
  inherits RefObject, AbstractObject
  # initialization method
  initialize: ->
    @RefCount = 0
    if @init
      console.error "init method is deprecated, pls use initialize instead"
      RefObject::init = (->) unless RefObject::init
      @init.apply @, arguments # keep back compatibility
  addRef: ->
    ++@RefCount
  release: ->
    result = --@RefCount
    @destroy.apply @, arguments if result < 0
    result
  free: @::release

