### 
# eventable your class, add the following methods and event to your class
# * Methods:
#   * dispatch(event, args[, callback]) 
#   * dispatchError(error[, callback])
# * Events:
#   * initing: emit before the init method
#   * inited: emit after the init method
#   * destroying: emit before the final method
#   * destroyed: emit after the final method
###

extend            = require 'util-ex/lib/_extend'
isArray           = require 'util-ex/lib/is/type/array'
isFunction        = require 'util-ex/lib/is/type/function'
isUndefined       = require 'util-ex/lib/is/type/undefined'
eventable         = require 'events-ex/eventable'
AbstractObject    = require './abstract-object'
OBJECT_STATES_STR = AbstractObject.OBJECT_STATES_STR

module.exports = (aClass, aOptions)->
  aOptions = {} unless aOptions
  aOptions.methods = {} unless aOptions.methods
  extend aOptions.methods,
    # override methods:
    initialize: ->
      self = @self
      self.setMaxListeners(Infinity)
      @super.apply self, arguments
    setObjectState: (value, emitted = true)->
      self= @self
      @super.call(self, value)
      self.emit value, self if emitted
      return
    changeObjectState: (value, emitted = true) ->
      self= @self
      @super.call(self, value)
      if emitted
        if not value?
          self.emit "destroyed", self
        else
          self.emit OBJECT_STATES_STR[value], self
    # new methods added:
    # 
    dispatch: (event, args, callback) ->
      if isUndefined(callback) and isFunction(args)
        callback = args
        args = []
      else if not isArray(args)
        args = [args]
      return if callback and callback.apply(this, args) isnt false
      args.splice(0, 0, event)
      @emit.apply this, args
    dispatchError: (error, callback)->
      return if callback and callback(error) isnt false
      @emit('error', error)
  eventable aClass, aOptions

