chai            = require 'chai'
assert          = chai.assert
should          = chai.should()

util            = require "../lib/util"

describe "isEmpty", ->
  isEmpty = util.isEmpty
  isEmptyFunction = util.isEmptyFunction

  it "should be empty", ->
    assert.ok isEmpty(null)
    assert.ok isEmpty("")
    assert.ok isEmpty({})
    assert.ok isEmpty([])
    (->
      assert.ok isEmpty(arguments)
    )()
    assert.notOk isEmpty("hi")
    assert.notOk isEmpty(length: 0)
    assert.notOk isEmpty([1])
    (->
      assert.notOk isEmpty(arguments)
    ) 1

  it "should be empty function", ->
    emptyFunc = ->
    isEmpty(emptyFunc).should.be.true "emptyFunc"
    emptyFunc = (abc, ase)->
    isEmpty(emptyFunc).should.be.true "emptyFunc2"
    isEmptyFunction("function(arg1, arg2, arg3){\n}").should.be.true
    isEmptyFunction("function(arg1, arg2, arg3){\n;}").should.be.true
    isEmptyFunction("function   asFn  (arg1, arg2, arg3){\n\n;}").should.be.true
    isEmptyFunction("function(arg1, arg2, arg3){abs;}").should.not.be.true
    

describe "inherits", ->
  inherits = util.inherits

  aMethod = ->
    "aMethod"
  a1Method = ->
    "a1Method"


  Root = ->
    "Root"

  Root::className = "Root"
  Root::rootMethod = ->

  B = ->
    "B"

  B::className = "B"
  B::bMethod = ->

  A = ->

  A::aMethod = aMethod
  A::className = "A"
  A1 = ->
    "A1"

  A1::a1Method = a1Method
  A1::className = "A1"

  it "inherits and isInheritedFrom", ->
    assert.equal util.inherits(A, Root), true
    assert.equal util.inherits(A, Root), false
    assert.equal util.inherits(B, Root), true
    assert.equal util.inherits(A1, A), true
    assert.equal A1.super_, A
    assert.equal A1::a1Method, a1Method
    assert.equal A::aMethod, aMethod
    assert.equal A1::constructor, A1
    assert.equal util.inherits(A1, Root), false, "A1 can not inherit Root again"
    assert.equal A1.super_, A
    assert.equal A.super_, Root
    assert.equal Root.super_, undefined
    assert.equal util.isInheritedFrom(A1, Root), true
    assert.equal util.isInheritedFrom(A1, A), true
    assert.equal util.isInheritedFrom(A1, B), false, "A1 is not inherited from B"

  it "inheritsObject", ->
    cMethod = ->
      "cMethod"
    C = ->
      "C"

    C::className = "C"
    C::cMethod = cMethod
    b = new B()
    assert.equal util.inheritsObject(b, C), true
    bProto = b.__proto__
    assert.equal bProto.cMethod, cMethod
    assert.equal bProto.constructor, C
    assert.equal C.super_, B
    b1 = new B()
    assert.equal util.inheritsObject(b1, C), true
    bProto = b1.__proto__
    assert.equal bProto.cMethod, cMethod
    assert.equal bProto.constructor, C
    assert.equal bProto, C::

