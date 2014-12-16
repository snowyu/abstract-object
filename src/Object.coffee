EventEmitter  = require("events").EventEmitter
util          = require("./util")

inherits      = util.inherits


# AbstractObject with Object State Events Supports.
# class should overwrite the init, final methods.
#
# * Methods:
#   * init: abstract initialization method after a new instance creating.
#     * the constructor's arguments should be passed into init method.
#   * final: abstract finalization method before the instance destroying.
#   * free: free the class instance.
#
# * Events:
#   * initing: emit before the init method
#   * inited: emit after the init method
#   * destroying: emit before the final method
#   * destroyed: emit after the final method

# the object state constants:
OBJECT_STATES =
  initing: 1
  inited: 2
  destroying: 0
  destroyed: null

OBJECT_STATES_STR = ["destroying", "initing", "inited"]

module.exports = class AbstractObject
  inherits AbstractObject, EventEmitter
  OBJECT_STATES: OBJECT_STATES
  @::__defineGetter__ "Class", ->
    return @__proto__.constructor
  @.prototype.__defineGetter__ "objectState", ->
    vState = @_objectState_
    if not vState? then "destroyed" else OBJECT_STATES_STR[vState]
  setObjectState: (value, emitted = true)->
    @_objectState_ = OBJECT_STATES[value]
    @emit value, @ if emitted
    return
  changeObjectState: (value, emitted = true) ->
    @_objectState_ = value
    if emitted
      if not value?
        @emit "destroyed", @ 
      else
        @emit OBJECT_STATES_STR[value], @

  # abstract initialization method
  init: ->
  # abstract finalization method
  final:->
  constructor: ->
    #@setObjectState "initing"
    @changeObjectState OBJECT_STATES.initing
    @setMaxListeners(Infinity)
    if @init.apply(@, arguments) isnt true
      @changeObjectState OBJECT_STATES.inited
  destroy: ->
    @changeObjectState OBJECT_STATES.destroying
    @final()
    @changeObjectState OBJECT_STATES.destroyed
  free: ->
    @destroy()
  @create: (aClass)->
    result = util.createObjectApply(aClass, arguments)
    if aClass isnt aClass::constructor
      aClass::constructor.apply(result, Array.prototype.slice.call(arguments, 1))
      # Note aClass = undefined if remove the first argument
      #ctor = aClass::constructor
      #Array.prototype.splice.call(arguments, 0, 1)
      #ctor.apply(result, arguments)
    ###
    if util.isEmptyFunction(aClass::constructor)
      ctor = util.getConstructor(aClass.super_)
      Array.prototype.splice.call(arguments, 0, 1)
      ctor.apply(result, arguments)# if ctor
    ###
    result

