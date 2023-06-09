import {extend, isArray, isFunction, isUndefined} from 'util-ex'
import {AdditionalInjectionType} from 'custom-ability'
import {OBJECT_STATES_STR} from './stateable'

export let MAX_LISTENERS = 2e308

export function eventableOptions(aOptions) {
  if (!aOptions) {
    aOptions = {}
  }
  if (!aOptions.methods) {
    aOptions.methods = {}
  }

  aOptions.type = AdditionalInjectionType.direct
  aOptions.id = 'stateable'

  const maxListeners = aOptions.maxListeners || MAX_LISTENERS

  extend(aOptions.methods, {
    initialize() {
      const self = this.self
      self.setMaxListeners(maxListeners)
      return this["super"].apply(self, arguments)
    },
    setObjectState(value, emitted) {
      if (emitted == null) {
        emitted = true
      }
      const self = this.self
      this["super"].call(self, value)
      if (emitted) {
        self.emit(value, self)
      }
    },
    changeObjectState(value, emitted) {
      if (emitted == null) {
        emitted = true
      }
      const self = this.self
      this["super"].call(self, value)
      if (emitted) {
        if (value == null) {
          return self.emit("destroyed", self)
        } else {
          return self.emit(OBJECT_STATES_STR[value], self)
        }
      }
    },
    dispatch(event, args, callback) {
      if (isUndefined(callback) && isFunction(args)) {
        callback = args
        args = []
      } else if (!isArray(args)) {
        args = [args]
      }
      if (callback && callback.apply(this, args) !== false) {
        return
      }
      args.splice(0, 0, event)
      return this.emit.apply(this, args)
    },
    dispatchError(error, callback) {
      if (callback && callback(error) !== false) {
        return
      }
      return this.emit('error', error)
    }
  })
  return aOptions
}

export default eventableOptions
