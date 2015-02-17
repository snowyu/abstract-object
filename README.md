### AbtractObject [![Build Status](https://img.shields.io/travis/snowyu/abstract-object/master.png)](http://travis-ci.org/snowyu/abstract-object) [![npm](https://img.shields.io/npm/v/abstract-object.svg)](https://npmjs.org/package/abstract-object) [![downloads](https://img.shields.io/npm/dm/abstract-object.svg)](https://npmjs.org/package/abstract-object) [![license](https://img.shields.io/npm/l/abstract-object.svg)](https://npmjs.org/package/abstract-object)

AbstractObject with Object State Supports and `free` method provides.

The derived class should overwrite the `initialize` and `finalize` methods.


# Changes

## V2.1.x

+ add the state-able ability to any class.
- **<broken change>** move RefObject to [ref-object](https://github.com/snowyu/ref-object.js)
* decoupled the abstract-object completely.
* All parts can be used individually.
  * stateable = require('abstract-object/ability')
  * eventable = require('events-ex/eventable')
  * refCountable = require('ref-object/ability')

## V2.x

* **<broken change>** separate eventable from AbstractObject
  + the new EventableObject can be as AbstractObject@v1.x
* **<broken change>** separate eventable from RefObject too
  + the new EventableRefObject can be as RefObject@v1.x
+ add the eventable function to eventable any class('abstract-object/eventable').
  * use the eventable plugin([events-ex](https://github.com/snowyu/events-ex.js)) to implement eventable object.
- move all util functions to [util-ex](https://github.com/snowyu/util-ex.js)
- move enhanced inheritance Functions to [inherits-ex](https://github.com/snowyu/inherits-ex.js).
- move AbstractError to [abstract-error](https://github.com/snowyu/abstract-error.js)

## V1.x

* AbstractObject inherits from EventEmitter.
* RefObject inherits from AbstractObject
* AbstractError

# State-able Ability(V2.1.x)

add the Object State Supports and `free` method to your class directly.

```coffee
stateable = require 'abstract-object/ability'

module.exports = class AbstractObject
  stateable AbstractObject

```


# AbstractObject

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


* only for EventableObject:
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


# RefObject

RefObject has moved to [ref-object](https://github.com/snowyu/ref-object.js)

The `RefObject` is derived from AbstractObject. and add the `RefCount` and `AddRef/Release` Supports.

* methods:
  * `release()`/`free()`: Decrements reference count for this instance.
    If it is becoming less than 0, the object would be (self) destroyed.
  * `addRef()`: Increments the reference count for this instance
    and returns the new reference count.


# Usage:

```coffee
AbstractObject = require('abstract-object')
RefObject = require('abstract-object/RefObject')
inherits = require('inherits-ex')
createObject = AbstractObject.createObject

class MyObject
  inherits MyObject, RefObject
  initialize: (@a,@b)->
    super

myObj = createObject(MyObject, 1, 2)

# if you do not wanna use `AbstractObject.create`, you MUST remember this:
# even the constructor is empty, you should call the parent's constructor manually.
# myObj = new MyObject()

class MyObject
  inherits MyObject, RefObject
  constructor: ->
    # must call super method here:
    super
  initialize: (@a,@b)->
    # must call super method here for RefObject initialization:
    super

```

the javascript:

```js

var AbstractObject = require('abstract-object')
var RefObject = require('abstract-object/RefObject')
var inherits = require('inherits-ex')
var createObject = AbstractObject.createObject

//if you do not wanna to use the 'AbstractObject.create'(createObject):
var MyObject = function() {
  //super call
  MyObject.__super__.constructor.apply(this, arguments);
}
// or, this MUST use 'AbstractObject.create'
var MyObject = function(){}


inherits(MyObject, RefObject)


MyObject.prototype.initialize = function(a,b) {
  //super call
  MyObject.__super__.initialize.call(this)
  this.a = a
  this.b = b
}


var myObj = createObject(MyObject, 1, 2)
//or this,  must overwrite the constructor and call the super constructor.
var myObj = new MyObject(1,2)
```

# AbstractError Classes

Moved to [abstract-error](https://github.com/snowyu/abstract-error.js).

## AbstractError

All Errors are derived from the AbstractError.

* Members:
  * message: the error message.
  * code: the error code.
* Methods:
  * ok()
  * notFound()
  * ....
  * invalidFormat()
* Class Methods:
  * AbstractError.isOk(err)
  * AbstractError.isNotFound(err)
  * ...

the error codes:

* AbstractError.Ok              = 0
* AbstractError.NotFound        = 1
* AbstractError.Corruption      = 2
* AbstractError.NotSupported    = 3
* AbstractError.InvalidArgument = 4
* AbstractError.IO              = 5
* AbstractError.NotOpened       = 6
* AbstractError.InvalidType     = 7
* AbstractError.InvalidFormat   = 8


## Other Error Classes:

* NotFoundError
* CorruptionError
* NotSupportedError/NotImplementedError
* InvalidArgumentError
* IOError
* NotOpenedError
* InvalidTypeError
* InvalidFormatError


## Extends the AbstractError

use the `createError` function can extend the AbstractError.

createError(typeName, errorCode[, parentErrorClass])

__arguments__

* typeName *(string)*: the error type name, the first character must be upper case.
* errorCode: *(number)*: the error code, it should be greater than 1000.
* parentErrorClass: *(class)*:  the optional parent error class. defaults to AbstractError.

__return__

* the error class


### Usage

```js


var Errors = require("abstract-object/Error")
var AbstractError = Errors.AbstractError
var createError = Errors.createError


var AlreadyReadError = createError('AlreadyRead', 10000)

var err = new AlreadyReadError("already read over error.")

assert.ok(AbstractError.isAlreadyRead(err))
assert.ok(AlreadyReadError.isAlreadyRead(err))
assert.ok(err.alreadyRead())
assert.equal(err.message, "already read over error.")
assert.equal(err.code, 10000)

```

# Enhanced Inheritance Functions

Moved to [inherits-ex](https://github.com/snowyu/inherits-ex.js).

# Util Functions

Moved to [util-ex](https://github.com/snowyu/util-ex.js).
