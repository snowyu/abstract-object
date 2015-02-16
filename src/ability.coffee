customAbility     = require 'custom-ability'
createObject      = require('inherits-ex/lib/createObject')
createObjectWith  = require('inherits-ex/lib/createObjectWith')
isArray           = require('util-ex/lib/is/type/array')
isFunction        = require('util-ex/lib/is/type/function')
isUndefined       = require('util-ex/lib/is/type/undefined')
defineProperty    = require('util-ex/lib/defineProperty')

# AbstractObject with Object State Supports.
# class should overwrite the initialize, finalize methods.
#
# * Methods:
#   * initialize: abstract initialization method after a new instance creating.
#     * the constructor's arguments should be passed into init method.
#   * finalize: abstract finalization method before the instance destroying.
#   * free: free the class instance.
#

# the object state constants:
OBJECT_STATES =
  initing: 1
  inited: 2
  destroying: 0
  destroyed: null

OBJECT_STATES_STR = ['destroying', 'initing', 'inited']

class Stateable
  OBJECT_STATES: OBJECT_STATES
  @OBJECT_STATES_STR: OBJECT_STATES_STR
  defineProperty @::, 'objectState', null,
    get:->
      vState = @_objectState_
      if not vState? then 'destroyed' else OBJECT_STATES_STR[vState]
  for vStateName, vState of OBJECT_STATES
    s = 'is'+ vStateName[0].toUpperCase() + vStateName.slice(1)
    @::[s] = ((aState)->
      -> @_objectState_ is aState
    )(vState)
  setObjectState: (value)->
    @_objectState_ = OBJECT_STATES[value]
    return
  changeObjectState: (value) ->
    @_objectState_ = value
    return

  # abstract initialization method
  initialize: ->
    if isFunction @init
      console.error 'init method is deprecated, pls use initialize instead'
      Stateable::init = (->) unless Stateable::init
      @init.apply @, arguments
  # abstract finalization method
  finalize: ->
    if isFunction @final
      console.error 'final method is deprecated, pls use finalize instead'
      Stateable::final = (->) unless Stateable::final
      @final.apply @, arguments
  _constructor: ->
    #@setObjectState 'initing'
    defineProperty @, '_objectState_', null
    @changeObjectState OBJECT_STATES.initing
    if @initialize.apply(@, arguments) isnt true
      @changeObjectState OBJECT_STATES.inited
  destroy: ->
    @changeObjectState OBJECT_STATES.destroying
    @finalize.apply @, arguments
    @changeObjectState OBJECT_STATES.destroyed
    @removeAllListeners()
  free: ->
    @destroy.apply @, arguments
  @create: createObject
  @createWith: createObjectWith

module.exports = customAbility Stateable, 'objectState'
