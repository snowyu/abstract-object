import {extend, isArray, isFunction, isUndefined} from 'util-ex'
import {OBJECT_STATES_STR} from './stateable'

// eslint-disable-next-line @typescript-eslint/no-loss-of-precision
export const MAX_LISTENERS = 2e308

/*
 * eventable your class, add the following methods and event to your class
 * * Methods:
 *   * dispatch(event, args[, callback])
 *   * dispatchError(error[, callback])
 * * Events:
 *   * initing: emit before the init method
 *   * inited: emit after the init method
 *   * destroying: emit before the final method
 *   * destroyed: emit after the final method
 */
export function eventableOptions(aOptions) {
  const result = {methods: {}, required: ['setMaxListeners', 'emit']}

  // let vIncludes = aOptions.include
  // if (!vIncludes) {vIncludes = aOptions.include = []}
  // if (!Array.isArray(vIncludes)) {aOptions.include = vIncludes = [vIncludes]}
  // ['setMaxListeners', 'emit'].forEach(function(item) {
  //   if (vIncludes.indexOf(item) === -1) {vIncludes.push(item)}
  // })

  // aOptions.type = AdditionalInjectionType.direct
  // aOptions.id = 'stateable'

  const maxListeners = (aOptions && aOptions.maxListeners) || MAX_LISTENERS

  extend(result.methods, {
    initialize() {
      const self = this.self
      self.setMaxListeners(maxListeners)
      return this.super.apply(self, arguments)
    },
    setObjectState(value, emitted) {
      if (emitted == null) {
        emitted = true
      }
      const self = this.self
      this.super(value)
      if (emitted) {
        self.emit(value, self)
      }
    },
    changeObjectState(value, emitted) {
      if (emitted == null) {
        emitted = true
      }
      const self = this.self
      this.super(value)
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
  return result
}

export default eventableOptions
