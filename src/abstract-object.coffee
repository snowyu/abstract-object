stateable = require './ability'

module.exports = class AbstractObject
  stateable AbstractObject
  constructor: ->@_constructor.apply @, arguments
