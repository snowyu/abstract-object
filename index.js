var defineProperty = require('util-ex/lib/defineProperty')
var AbstractObject = require('./lib/abstract-object')

defineProperty(AbstractObject.prototype, '$abilities', {
  Eventable: require('./lib/eventable-options')
})
/*
AbstractObject.prototype.$abilities = {
  eventable: require('./eventable')
}*/
module.exports = AbstractObject 
