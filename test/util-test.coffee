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


  Root = (@inited="Root", @other)->
    "Root"

  Root::className = "Root"
  Root::rootMethod = ->

  B = (@inited="B")->
    "B"

  B::className = "B"
  B::bMethod = ->

  A = ->

  A::aMethod = aMethod
  A::className = "A"
  A1 = (@inited="A1")->
    "A1"

  A1::a1Method = a1Method
  A1::className = "A1"

  it "test inherits and isInheritedFrom", ->
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
    assert.equal util.isInheritedFrom(A, B), false, "A is not inherited from B"

  it "test inheritsObject", ->
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

  describe "createObject", ->
    createObject = util.createObject

    it 'should call the parent\'s constructor method if it no constructor', ->
      A12 = ->
      assert.equal inherits(A12, A1), true
      a = createObject(A12)
      assert.instanceOf a, A12
      assert.instanceOf a, A1
      assert.instanceOf a, A
      assert.instanceOf a, Root
      assert.equal a.inited, "A1"

    it 'should call the root\'s constructor method if its parent no constructor yet', ->
      A2 = ->
      assert.equal inherits(A2, A), true
      a = createObject(A2)
      assert.instanceOf a, A2
      assert.instanceOf a, A
      assert.instanceOf a, Root
      assert.equal a.inited, "Root"
    it 'should pass the correct arguments to init', ->
      class A2
      assert.equal inherits(A2, A), true
      a = createObject(A2, "hiFirst", 1881)
      assert.instanceOf a, A2
      assert.instanceOf a, A
      assert.instanceOf a, Root
      assert.equal a.inited, "hiFirst"
      assert.equal a.other, 1881
    it 'should pass the correct arguments to constructor', ->
      A2 = (@first, @second)->
      assert.equal inherits(A2, A), true
      a = createObject(A2, "hiFirst", 1881)
      assert.instanceOf a, A2
      assert.instanceOf a, A
      assert.instanceOf a, Root
      assert.equal a.first, "hiFirst"
      assert.equal a.second, 1881
      should.not.exist a.inited
      should.not.exist a.other

  describe "createObjectWith", ->
    createObject = util.createObjectWith

    it 'should call the parent\'s constructor method if it no constructor', ->
      class A12
      assert.equal inherits(A12, A1), true
      a = createObject(A12)
      assert.instanceOf a, A12
      assert.instanceOf a, A1
      assert.instanceOf a, A
      assert.instanceOf a, Root
      assert.equal a.inited, "A1"

    it 'should call the root\'s constructor method if its parent no constructor yet', ->
      class A2
      assert.equal inherits(A2, A), true
      a = createObject(A2)
      assert.instanceOf a, A2
      assert.instanceOf a, A
      assert.instanceOf a, Root
      assert.equal a.inited, "Root"
    it 'should pass the correct arguments to init', ->
      class A2
      assert.equal inherits(A2, A), true
      a = createObject(A2, ["hiFirst", 1881])
      assert.instanceOf a, A2
      assert.instanceOf a, A
      assert.instanceOf a, Root
      assert.equal a.inited, "hiFirst"
      assert.equal a.other, 1881
    it 'should pass the correct arguments to constructor', ->
      class A2
        constructor: (@first, @second)->
      assert.equal inherits(A2, A), true
      a = createObject(A2, ["hiFirst", 1881])
      assert.instanceOf a, A2
      assert.instanceOf a, A
      assert.instanceOf a, Root
      assert.equal a.first, "hiFirst"
      assert.equal a.second, 1881
      should.not.exist a.inited
      should.not.exist a.other
    it 'should pass the correct arguments to init for internal arguments', ->
      class A2
        constructor: ->
          if not (this instanceof A2)
            return createObject(A2, arguments)
          super
      assert.equal inherits(A2, A), true
      a = A2("hiFirst~", 1181)
      assert.instanceOf a, A2
      assert.instanceOf a, A
      assert.instanceOf a, Root
      assert.equal a.inited, "hiFirst~"
      assert.equal a.other, 1181


