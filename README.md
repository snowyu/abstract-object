# AbtractObject [![Build Status](https://img.shields.io/travis/snowyu/abstract-object/master.png)](http://travis-ci.org/snowyu/abstract-object) [![npm](https://img.shields.io/npm/v/abstract-object.svg)](https://npmjs.org/package/abstract-object) [![downloads](https://img.shields.io/npm/dm/abstract-object.svg)](https://npmjs.org/package/abstract-object) [![license](https://img.shields.io/npm/l/abstract-object.svg)](https://npmjs.org/package/abstract-object)

AbstractObject with Object State Supports and `free` method provides.

The derived class should overwrite the `initialize` and `finalize` methods.

## State-able Ability

add the Object State Supports and `free` method to your class directly.

You must call the `_constructor` of the state-able ability in the constructor method.

```js
import {stateable} from 'abstract-object'

export class MyStateObject {
  constructor() {
    this._constructor.apply(this, arguments)
  }
}
stateable(MyStateObject)

export default MyStateObject

```

Let state-able object supports the event.

```js
import {stateable} from 'abstract-object'
import {eventable} from 'events-ex'

class MyObject {
  constructor() {
    this._constructor.apply(this, arguments)
  }
}
stateable(MyObject)
eventable(MyObject)
```

## AbstractObject

* Methods:
  * `create`(class, ...): the `create` class method uses to create a new object instance(the util.createObject is the same function).
    * `class`: the class constructor to create a new instance.
    * `...`: the left arguments will be passed into the class constructor.
  * `createWith`(class, arguments): the `createWith` class method uses to create a new object instance(the util.createObjectWith is the same function).
    * `class`: the class constructor to create a new instance.
    * `arguments` *(array)*: the arguments will be passed into the class constructor.
  * `initialize(...)`: abstract initialization method after a new instance creating.
    * `...`: the constructor's arguments should be passed into initialize method.
  * `finalize`(...): abstract finalization method before the instance destroying.
    * `...`: the free(destroy)'s arguments should be passed into finalize method.
  * (**deprecated**) *`init(...)`: abstract initialization method after a new instance creating.*
    * init method is deprecated, pls use initialize method instead
    * `...`: the constructor's arguments should be passed into init method.
  * (**deprecated**) *`final`(...): abstract finalization method before the instance destroying.*
    * final method is deprecated, pls use finalize instead
    * `...`: the free(destroy)'s arguments should be passed into final method.
  * `free`(...): free the class instance.
    * `...`: optional arguments will be passed into final method to process.
  * `isIniting`(), `isInited`(),`isDestroying`(), `isDestroyed`() object state testing methods:
    * to test object state


* only added/injected [eventable ability](https://github.com/snowyu/events-ex.js):
  * Methods:
    * `dispatch`(event, args[, callback]): dispath an event or callback
      * `event`: the event name
      * `args`: the args are passed to event or callback
      * `callback`: optional, it will not dispatch event if the callback is exists, unless the callback return false.
    * `dispatchError`(error[, callback]):
      * `error`: the error instance.
      * `callback`: optional, it will not dispatch `'error'` event if the callback is exists, unless the callback return false.
  * Events:
    * `'initing'`: emit before the initialize method
    * `'inited'`: emit after the initialize method
    * `'destroying'`: emit before the finalize method
    * `'destroyed'`: emit after the finalize method

## Usage

```js
import {AbstractObject} from 'abstract-object'

class MyObject extends AbstractObject {
  initialize(a, b) {
    this.a = a
    this.b = b
    this.cache = {}
  }
  finalize() {
    this.cache = null
  }
}
const myObj = new MyObject(1, 2)
```

## RefObject

RefObject has been moved to [ref-object](https://github.com/snowyu/ref-object.js)

The `RefObject` is derived from AbstractObject. and add the `RefCount` and `AddRef/Release` Supports.

* methods:
  * `release()`/`free()`: Decrements reference count for this instance.
    If it is becoming less than 0, the object would be (self) destroyed.
  * `addRef()`: Increments the reference count for this instance
    and returns the new reference count.

## AbstractError Classes

It has been moved to [abstract-error](https://github.com/snowyu/abstract-error.js).


## Changes

### V3.x

* **broken change** Remove deprecated `ref-object.js` , `RefObject.js` and `eventable-ref-object.js` files
  * these files are now part of the [ref-object](https://github.com/snowyu/ref-object.js).
* **broken change** Remove deprecated `util` to [util-ex](https://github.com/snowyu/util-ex.js) package.
* **broken change** Remove deprecated `Error` to [abstract-error](https://github.com/snowyu/abstract-error.js) package.


### V2.1.x

+ add the state-able ability to any class.
- **<broken change>** move RefObject to [ref-object](https://github.com/snowyu/ref-object.js)
* decoupled the abstract-object completely.
* All parts can be used individually.
  * stateable = require('abstract-object/ability')
  * eventable = require('events-ex/eventable')
  * refCountable = require('ref-object/ability')

### V2.x

* **<broken change>** separate eventable from AbstractObject
  + the new EventableObject can be as AbstractObject@v1.x
* **<broken change>** separate eventable from RefObject too
  + the new EventableRefObject can be as RefObject@v1.x
+ add the eventable function to eventable any class('abstract-object/eventable').
  * use the eventable plugin([events-ex](https://github.com/snowyu/events-ex.js)) to implement eventable object.
- move all util functions to [util-ex](https://github.com/snowyu/util-ex.js)
- move enhanced inheritance Functions to [inherits-ex](https://github.com/snowyu/inherits-ex.js).
- move AbstractError to [abstract-error](https://github.com/snowyu/abstract-error.js)

### V1.x

* AbstractObject inherits from EventEmitter.
* RefObject inherits from AbstractObject
* AbstractError
