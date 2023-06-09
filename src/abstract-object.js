import stateable from './stateable'

export function AbstractObject() {
  this._constructor.apply(this, arguments)
}

stateable(AbstractObject)

export default AbstractObject
