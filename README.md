# AbtractObject [![Build Status](https://img.shields.io/travis/snowyu/abstract-object/master.png)](http://travis-ci.org/snowyu/abstract-object) [![npm](https://img.shields.io/npm/v/abstract-object.svg)](https://npmjs.org/package/abstract-object) [![downloads](https://img.shields.io/npm/dm/abstract-object.svg)](https://npmjs.org/package/abstract-object) [![license](https://img.shields.io/npm/l/abstract-object.svg)](https://npmjs.org/package/abstract-object) 

AbstractObject with Object State Events Supports and `free` method provides.

The derived class should overwrite the `initialize` and `finalize` methods.

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
  * `dispatch`(event, args[, callback]): dispath an event or callback
    * `event`: the event name
    * `args`: the args are passed to event or callback
    * `callback`: optional, it will not dispatch event if the callback is exists, unless the callback return false.
  * `dispatchError`(error[, callback]):
    * `error`: the error instance.
    * `callback`: optional, it will not dispatch `'error'` event if the callback is exists, unless the callback return false.
  * `isIniting`(), `isInited`(),`isDestroying`(), `isDestroyed`() object state testing methods:
    * to test object state

* Events:
  * `'initing'`: emit before the initialize method
  * `'inited'`: emit after the initialize method
  * `'destroying'`: emit before the finalize method
  * `'destroyed'`: emit after the finalize method


# RefObject

The `RefObject` is derived from AbstractObject. and add the `RefCount` and `AddRef/Release` Supports.

* methods:
  * `release`/`free`: Decrements reference count for this instance. 
    If it is becoming less than 0, the object would be (self) destroyed. 
  * `addRef`: Increments the reference count for this instance
    and returns the new reference count.


# Usage:

```coffee
AbstractObject = require('abstract-object')
RefObject = require('abstract-object/RefObject')
inherits = require('abstract-object/lib/util/inherits')
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
var util = require('abstract-object/lib/util')
var createObject = AbstractObject.createObject

//if you do not wanna to use the 'AbstractObject.create'(createObject):
var MyObject = function() {
  //super call
  MyObject.__super__.constructor.apply(this, arguments);
}
// or, this MUST use 'AbstractObject.create'
var MyObject = function(){}


util.inherits(MyObject, RefObject)


MyObject.prototype.initialize = function(a,b) {
  //super call
  MyObject.__super__.initialize.call(this);
  this.a = a
  this.b = b
}


var myObj = createObject(MyObject, 1, 2)
//or this,  must overwrite the constructor and call the super constructor.
var myObj = new MyObject(1,2)
```

# AbstractError Classes

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

# util functions

## inherits(ctor, superCtor|[superCtor, ...])

```js
  var inherits = require('abstract-object/lib/util/inherits')
```

Browser-friendly enhanced inheritance fully compatible with standard node.js
[inherits](http://nodejs.org/api/util.html#util_util_inherits_constructor_superconstructor)
and coffee-script.

+ coffee-script supports
+ multi-inheritances(inheritance chain) supports
+ inherits at anytime.
  * you can not declare method/property before inherits in the standard way for it will replace the prototype object.
+ duplication inheritance check

The standard `inherits` implementation is in `abstract-object/lib/util/inheritsDirectly`,
of casue it's the coffee-script supports and browser-friendly.

### usage

```coffee

assert = require('assert')
inherits = require('abstract-object/lib/util/inherits')
isInheritedFrom = require('abstract-object/lib/util/isInheritedFrom')
log = console.log.bind console

class Root
  m: -> log('root')

class A
  inherits A, Root
  m: ->
  log('A')
  super

class B
  inherits B, Root
  m: -> log('B')
  super

class MyClass
  # MyClass -> A -> Root
  inherits MyClass, B
  # MyClass -> A -> B -> Root
  inherits MyClass, A

assert.notOk inherits(A, Root) #duplication inheritances prohibited.
assert.ok isInheritedFrom(MyClass, A)
assert.ok isInheritedFrom(MyClass, Root)
assert.ok isInheritedFrom(MyClass, B)

```

and the following codes do same thing:

```coffee

class Root
  m: -> log('root')

class A
  m: ->
  log('A')
  super

class B
  m: -> log('B')
  super

class MyClass
  # create inheritances chain:
  # MyClass -> A -> B -> Root
  inherits MyClass, [A, B, Root]

assert.ok isInheritedFrom(MyClass, A)
assert.ok isInheritedFrom(MyClass, Root)
assert.ok isInheritedFrom(MyClass, B)

```

## inheritsDirectly(ctor, superCtor)

```js
  var inheritsDirectly = require('abstract-object/lib/util/inheritsDirectly')
```

The standard `inherits` implementation in node.js environment with coffee-script supports
and browser-friendly.

## isInheritedFrom(ctor, superCtor|superCtorName, raiseError=false)

```js
  var isInheritedFrom = require('inherits-ex/lib/util/isInheritedFrom')
```

return the superCtor's son if ctor is inherited from superCtor.
else return false.

it will use the ctor.name to check whether inherited from superCtorName.

## mixin(ctor, superCtor|[superCtor, ...])

```js
  var mixin = require('abstract-object/lib/util/mixin')
```

mixin all superCtors to ctor.

+ the methods in mixins could super() across mixin classes.
+ duplication mixin check

``` coffee

mCallOrder = []
class Root
class C
  m: ->
    mCallOrder.push 'C'
    super
class A
  m: ->
    mCallOrder.push 'A'
class A1
  m: ->
    mCallOrder.push 'A1'
    super
class B
  inherits B, Root
class B1
  m: ->
    mCallOrder.push 'B1'
    super

inherits(C, Root).should.be.equal true, "C should inherits from Root"
inherits(B1, B).should.be.equal true, "B1 should inherits from B"
inherits(A1, A).should.be.equal true, "A1 should inherits from A"
mixin(B1, [A1, C]).should.be.equal true, 'mixin'
o = new B1()
o.m("a", 12) # call chain: B1::m -> C::m -> A1::m -> A::m
A::m.should.have.been.calledOnce
A::m.should.have.been.calledWith "a", 12
mCallOrder.should.be.deep.equal ['B1', 'C', 'A1', 'A']
```

The inheritance chain: `B1 -> MixinCtor_ -> B -> Root`
All mixins will be added to `MixinCtor_`.

## isMixinedFrom(ctor, superCtor|superCtorName)

```js
  var isMixinedFrom = require('abstract-object/lib/util/isMixinedFrom')
```

* [mixin: C3MRO](https://www.python.org/download/releases/2.3/mro/)
