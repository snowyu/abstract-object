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

eventable         = require 'events-ex/eventable'
addionalOptions   = require './eventable-options'
hasAbilityOnParent= require 'custom-ability/lib/has-ability-on-parent'

module.exports = (aClass, aOptions)->
  aOptions = addionalOptions(aOptions) unless hasAbilityOnParent aClass, 'Eventable'
  eventable aClass, aOptions

