chai            = require 'chai'
sinon           = require 'sinon'
sinonChai       = require 'sinon-chai'
assert          = chai.assert
should          = chai.should()

util            = require "../lib/util"

chai.use(sinonChai)

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


  
  class Root 
    constructor: (@inited="Root", @other)->"Root"
    rootMethod: ->

  class B 
    constructor: (@inited="B")->"B"
    bMethod: ->

  class A
    aMethod: aMethod

  class A1
    constructor: (@inited="A1")->"A1"
    a1Method: a1Method

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
    assert.equal util.isInheritedFrom(A, Root), A
    assert.equal util.isInheritedFrom(A1, Root), A
    assert.equal util.isInheritedFrom(A1, A), A1
    assert.equal util.isInheritedFrom(A1, B), false, "A1 is not inherited from B"
    assert.equal util.isInheritedFrom(A, B), false, "A is not inherited from B"
    o = new A()
    assert.equal o.rootMethod, Root::rootMethod
    o = new A1()
    assert.equal o.rootMethod, Root::rootMethod

  it "test isInheritedFrom with class name", ->
    isInheritedFrom = util.isInheritedFrom
    assert.equal isInheritedFrom(A, 'Root'), A
    assert.equal isInheritedFrom(A1, 'Root'), A
    assert.equal isInheritedFrom(A1, 'A'), A1
    assert.equal isInheritedFrom(A1, 'B'), false, "A1 is not inherited from B"
    assert.equal isInheritedFrom(A, 'B'), false, "A is not inherited from B"

  it "test inheritsObject", ->
    cMethod = ->
      "cMethod"
    C = ->
      "C"

    C.name = "C"
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
  it "test inheritsDirectly and isInheritedFrom", ->
    inheritsDirectly = util.inheritsDirectly
    isInheritedFrom = util.isInheritedFrom
    cMethod = ->"cMethod"
    R = ->"R"
    R.name = "R"
    C = ->"C"
    C.name = "C"
    C::cMethod = cMethod

    C1 = -> "C1"
    C1.name = "C1"
    C11 = -> "C11"
    C11.name = "C11"
    C2 = -> "C2"

    assert.ok inherits(C, R), "C inherits from R"
    assert.ok inherits(C1, C), "C1 inherits from C"
    assert.ok inherits(C11, C1), "C11 inherits from C1"
    assert.ok inherits(C2, C), "C2 inherits from C"
    # C11 > C1 > C
    baseClass = isInheritedFrom C11, C
    assert.equal baseClass, C1
    inheritsDirectly baseClass, C2
    # C11 > C1 > C2 > C
    assert.equal isInheritedFrom(C11, C2), C1, "C11 > C2"
    assert.equal isInheritedFrom(C11, C1), C11, "C11 > C1"
    assert.equal isInheritedFrom(C11, C), C2, "C11 > C"

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

describe "inject", ->
  inject = util.inject
  it "should inject a function before execution", ->
    run = (a,b,c)->[a,b,c]
    onBefore = sinon.spy()
    run = inject(run, onBefore)
    run(1,"b",3).should.be.deep.equal [1,"b",3]
    onBefore.should.have.been.calledWith(1,"b",3)
    onBefore.should.have.been.calledOnce

  it "should inject a function before execution and change the arguments", ->
    runOrg = sinon.spy (a,b,c)->[a,b,c]
    onBefore = sinon.spy (a,b,c)->a=2;b="B";c=4;arguments
    run = inject(runOrg, onBefore)
    run(1,"b",3).should.be.deep.equal [2,"B", 4]
    onBefore.should.have.been.calledWith(1,"b",3)
    onBefore.should.have.been.calledOnce
    runOrg.should.have.been.calledOnce

  it "should inject a function before execution and deny the original function execution", ->
    runOrg = sinon.spy (a,b,c)->[a,b,c]
    onBefore = sinon.spy ->false
    run = inject(runOrg, onBefore)
    run(1,"b",3).should.be.false
    onBefore.should.have.been.calledWith(1,"b",3)
    onBefore.should.have.been.calledOnce
    runOrg.should.have.not.been.called

  it "should inject a function after execution", ->
    runOrg = sinon.spy (a,b,c)->[a,b,c]
    onAfter = sinon.spy (a,b,c, result, isDenied)->
      a.should.be.equal 1
      b.should.be.equal "b" 
      c.should.be.equal 3
      result.should.be.deep.equal [1,"b",3]
      isDenied.should.be.false
      return
    run = inject(runOrg, null, onAfter)
    run(1,"b",3).should.be.deep.equal [1,"b",3]
    onAfter.should.have.been.calledWith(1,"b",3)
    onAfter.should.have.been.calledOnce
    runOrg.should.have.been.calledOnce

  it "should inject a function after execution and change result", ->
    runOrg = sinon.spy (a,b,c)->[a,b,c]
    onAfter = sinon.spy (a,b,c, result, isDenied)->
      a.should.be.equal 1
      b.should.be.equal "b" 
      c.should.be.equal 3
      result.should.be.deep.equal [1,"b",3]
      isDenied.should.be.false
      [1,2,3]
    run = inject(runOrg, null, onAfter)
    run(1,"b",3).should.be.deep.equal [1,2,3]
    onAfter.should.have.been.calledWith(1,"b",3)
    onAfter.should.have.been.calledOnce
    runOrg.should.have.been.calledOnce

  it "should inject a function before and after execution", ->
    runOrg = sinon.spy (a,b,c)->[a,b,c]
    onBefore = sinon.spy()
    onAfter = sinon.spy (a,b,c, result, isDenied)->
      a.should.be.equal 1
      b.should.be.equal "b" 
      c.should.be.equal 3
      result.should.be.deep.equal [1,"b",3]
      isDenied.should.be.false
      return
    run = inject(runOrg, onBefore, onAfter)
    run(1,"b",3).should.be.deep.equal [1,"b",3]
    onBefore.should.have.been.calledWith(1,"b",3)
    onBefore.should.have.been.calledOnce
    onAfter.should.have.been.calledWith(1,"b",3)
    onAfter.should.have.been.calledOnce
    runOrg.should.have.been.calledOnce

describe "isRegExp", ->
  isRegExp = util.isRegExp
  it "should check a RegExp instance correct", ->
    isRegExp(/ahi/).should.be.true
    isRegExp(new RegExp()).should.be.true
  it "should check an illegal RegExp argument correct", ->
    isRegExp().should.be.false
    isRegExp(RegExp).should.be.false
    isRegExp("/sdd/g").should.be.false

describe "isDate", ->
  isDate = util.isDate
  it "should check a Date instance correct", ->
    isDate(new Date()).should.be.true
    isDate(new Date(2015,1,1)).should.be.true
  it "should check an illegal date argument correct", ->
    isDate().should.be.false
    isDate(Date).should.be.false
    isDate("2015-01-01").should.be.false

describe "isUndefined", ->
  isUndefined = util.isUndefined
  it "should check undefined type correct", ->
    isUndefined(undefined).should.be.true
    isUndefined(`undefined`).should.be.true
  it "should check an other type to false", ->
    isUndefined(null).should.be.false
    isUndefined(Date).should.be.false
    isUndefined(false).should.be.false
    isUndefined(0).should.be.false
    isUndefined('undefined').should.be.false

describe "isNullOrUndefined", ->
  isNullOrUndefined = util.isNullOrUndefined
  it "should check undefined type correct", ->
    isNullOrUndefined(undefined).should.be.true
  it "should check null type correct", ->
    isNullOrUndefined(null).should.be.true
  it "should check an other type to false", ->
    isNullOrUndefined(Date).should.be.false
    isNullOrUndefined(false).should.be.false
    isNullOrUndefined(0).should.be.false
    isNullOrUndefined('undefined').should.be.false

describe "isObject", ->
  isObject = util.isObject
  it "should check object type correct", ->
    Obj = ->
    obj = Object.create(null)
    isObject({}).should.be.true
    isObject(obj).should.be.true
    isObject(new Obj()).should.be.true
    isObject(new Date()).should.be.true
    isObject(/dd/).should.be.true
  it "should check an other type to false", ->
    isObject(null).should.be.false
    isObject("object").should.be.false
    isObject(false).should.be.false
    isObject(true).should.be.false
    isObject(0).should.be.false
    isObject(->).should.be.false

describe "isFunction", ->
  isFunction = util.isFunction
  it "should check function type correct", ->
    isFunction(->).should.be.true
    isFunction(Date).should.be.true
    isFunction(RegExp).should.be.true
  it "should check an other type to false", ->
    isFunction(new RegExp()).should.be.false
    isFunction(new ->).should.be.false
    isFunction(false).should.be.false
    isFunction(true).should.be.false
    isFunction(0).should.be.false
    isFunction(null).should.be.false
    isFunction(undefined).should.be.false
    isFunction("").should.be.false

describe "isString", ->
  isString = util.isString
  it "should check string type correct", ->
    isString("").should.be.true
    isString("hello").should.be.true
  it "should check an other type to false", ->
    isString(new RegExp()).should.be.false
    isString(new ->).should.be.false
    isString(false).should.be.false
    isString(true).should.be.false
    isString(0).should.be.false
    isString(null).should.be.false
    isString(undefined).should.be.false
describe "_extend", ->
  extend = util._extend
  it "should extend an object", ->
    org = {a: 1, b:2}
    add = {a: 3}
    extend(org, add).should.be.equal org
    org.should.be.deep.equal {a:3, b:2}
    extend org, b:4, c:2
    org.should.be.deep.equal {a:3, b:4, c:2}
  it "should extend many object", ->
    org = {a: 1, b:2}
    add = {a: 3}
    third = {c:4}
    extend(org, add, third, {d:5, b:0}).should.be.equal org
    org.should.be.deep.equal {a:3, b:0, c:4, d:5}

describe "mixin", ->
  mixin = require('../src/util/mixin')
  isInheritedFrom = require('../src/util/isInheritedFrom')
  class A
    aMethod: ->
  class B1
    b1Method: ->
  class B2
    b2Method: ->
  it.skip "should mixin class", ->
    mixin A, B1, B2
    isInheritedFrom(A, B1).should.be.true "A is inherited from B1"
    isInheritedFrom(A, B2).should.be.true "A is inherited from B2"

   

