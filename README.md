# AbtractObject

[![Build Status](https://secure.travis-ci.org/snowyu/abstract-object.png?branch=master)](http://travis-ci.org/snowyu/abstract-object)

[![NPM](https://nodei.co/npm/abstract-object.png?stars&downloads&downloadRank)](https://nodei.co/npm/abstract-object/) [![NPM](https://nodei.co/npm-dl/abstract-object.png?months=6&height=3)](https://nodei.co/npm/abstract-object/)

AbstractObject with Object State Events Supports and `free` method provides.

The derived class should overwrite the `init`, `final` methods.

* Methods:
  * `create`(class): the `create` class method uses to create a new object instance.
    * class: the class constructor to create a new instance.
    * ...: the left arguments will be passed into the constructor.
  * `init`: abstract initialization method after a new instance creating.
    * the constructor's arguments should be passed into init method.
  * `final`: abstract finalization method before the instance destroying.
  * `free`: free the class instance.

* Events:
  * `'initing'`: emit before the init method
  * `'inited'`: emit after the init method
  * `'destroying'`: emit before the final method
  * `'destroyed'`: emit after the final method


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
inherits = require('abstract-object/lib/util').inherits

class MyObject
  inherits MyObject, RefObject
  init: (@a,@b)->
    super()

myObj = AbstractObject.create(MyObject, 1, 2)

# if you do not wanna use `AbstractObject.create`, you MUST remember this:
# even the constructor is empty, you should can the parent's constructor manually.

class MyObject
  inherits MyObject, RefObject
  constructor: ->
    super
  init: (@a,@b)->
    super()



```

the javascript:

```js

var AbstractObject = require('abstract-object')
var RefObject = require('abstract-object/RefObject')
var util = require('abstract-object/lib/util')

//if you do not wanna to use the 'AbstractObject.create':
var MyObject = function() {
  //super call
  MyObject.__super__.constructor.apply(this, arguments);
}
// or, this MUST use 'AbstractObject.create'
var MyObject = function(){}


util.inherits(MyObject, RefObject)


MyObject.prototype.init = function(a,b) {
  //super call
  MyObject.__super__.init.call(this);
  this.a = a
  this.b = b
}


var myObj = AbstractObject.create(MyObject, 1, 2)
```





