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

import {eventable as _eventable} from 'events-ex'
import additionalOptions from './eventable-options'
import {hasAbilityOnParent} from 'custom-ability'

export function eventable(aClass, aOptions) {
  if (!hasAbilityOnParent(aClass, 'Eventable')) {
    aOptions = additionalOptions(aOptions);
  }
  return _eventable(aClass, aOptions);
}

export default eventable
