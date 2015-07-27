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

module.exports = (aClass, aOptions)->
  vAbilities = aClass::$abilities
  aOptions = addionalOptions(aOptions) unless vAbilities and vAbilities.Eventable
  eventable aClass, aOptions

