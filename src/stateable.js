import {AdditionalInjectionMode, createAbilityInjector} from 'custom-ability'
import {createObject, createObjectWith} from 'inherits-ex'
import {defineProperty, isFunction} from 'util-ex'

import additionalOptions from './eventable-options'

export const OBJECT_STATES = {
  initing: 1,
  inited: 2,
  destroying: 0,
  destroyed: null
}

export const OBJECT_STATES_STR = ['destroying', 'initing', 'inited']

function Stateable() {}

Stateable.prototype.OBJECT_STATES = OBJECT_STATES

Stateable.OBJECT_STATES_STR = OBJECT_STATES_STR

defineProperty(Stateable.prototype, 'objectState', null, {
  get() {
    const vState = this._objectState_
    if (vState == null) {
      return 'destroyed'
    } else {
      return OBJECT_STATES_STR[vState]
    }
  }
})

for (const vStateName in OBJECT_STATES) {
  const vState = OBJECT_STATES[vStateName]
  const s = 'is' + vStateName[0].toUpperCase() + vStateName.slice(1)
  Stateable.prototype[s] = (function(aState) {
    return function() {
      return this._objectState_ === aState
    }
  })(vState)
}

Stateable.prototype.setObjectState = function(value) {
  this._objectState_ = OBJECT_STATES[value]
}

Stateable.prototype.changeObjectState = function(value) {
  this._objectState_ = value
}

Stateable.prototype.initialize = function() {
  if (isFunction(this.init)) {
    console.error('init method is deprecated, pls use initialize instead')
    if (!Stateable.prototype.init) {
      Stateable.prototype.init = (function() {})
    }
    return this.init.apply(this, arguments)
  }
}

Stateable.prototype.finalize = function() {
  if (isFunction(this.final)) {
    console.error('final method is deprecated, pls use finalize instead');
    if (!Stateable.prototype.final) {
      Stateable.prototype.final = (function() {})
    }
    return this.final.apply(this, arguments)
  }
}

Stateable.prototype._constructor = function() {
  defineProperty(this, '_objectState_', null)
  this.changeObjectState(OBJECT_STATES.initing)
  if (this.initialize.apply(this, arguments) !== true) {
    return this.changeObjectState(OBJECT_STATES.inited)
  }
}

Stateable.prototype.destroy = function() {
  this.changeObjectState(OBJECT_STATES.destroying)
  try {
    this.finalize.apply(this, arguments)
  } finally {
    this.changeObjectState(OBJECT_STATES.destroyed)
    if (this.removeAllListeners) {this.removeAllListeners()}
  }
  return this
}

Stateable.prototype.free = function() {
  return this.destroy.apply(this, arguments)
}

Stateable.create = createObject

Stateable.createWith = createObjectWith

const stateableOptions = {
  depends: {
    Eventable: {
      mode: AdditionalInjectionMode.target,
      getOpts: additionalOptions,
    }
  }
}

export const stateable = createAbilityInjector(Stateable, 'objectState', stateableOptions)

export default stateable
