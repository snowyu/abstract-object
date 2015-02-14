# AbstractObject with Object State Events Supports.
# * Methods:
#   * dispatch(event, args[, callback]) 
#   * dispatchError(error[, callback])
# * Events:
#   * initing: emit before the init method
#   * inited: emit after the init method
#   * destroying: emit before the final method
#   * destroyed: emit after the final method

eventable         = require './eventable'
module.exports    = AbstractObject  = require './abstract-object'

eventable AbstractObject
