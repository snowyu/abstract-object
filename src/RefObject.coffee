AbstractObject  = require("./Object")
util            = require("./util")

inherits        = util.inherits


# RefObject with RefCount and AddRef/Release Supports.
#
# * release/free: Decrements reference count for this instance. 
#   If it is becoming <0, the object would be (self) destroyed. 
# * addRef: Increments the reference count for this instance
#   and returns the new reference count.


module.exports = class RefObject
  inherits RefObject, AbstractObject
  # abstract initialization method
  init: ->
    @RefCount = 0
  addRef: ->
    ++@RefCount
  release: ->
    result = --@RefCount
    @destroy() if result < 0
    result
  free: RefObject.prototype.release

