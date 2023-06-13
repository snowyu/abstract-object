import {eventable} from 'events-ex'
import stateable from './stateable'

export function EventableObject() {
  this._constructor.apply(this, arguments)
}

stateable(EventableObject)
eventable(EventableObject)

export default EventableObject

