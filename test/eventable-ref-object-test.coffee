chai            = require 'chai'
sinon           = require 'sinon'
sinonChai       = require 'sinon-chai'
should          = chai.should()
AbstractObject  = require '../src/abstract-object'
RefObject       = require '../src/eventable-ref-object'
inherits        = require 'inherits-ex/lib/inherits'
setImmediate    = setImmediate || process.nextTick

chai.use(sinonChai)

describe "eventable RefObject", ->
    class TestObject
      inherits TestObject, RefObject
      finalize: sinon.spy -> RefObject::finalize.apply @, arguments
      initialize: ->
        super
        setImmediate =>
          @setObjectState "inited"
        return true
    #before (done)->
    #after (done)->
    it "RefObject constructor should be called", (done)->
      TestObject1 = ->
      TestObject1::initialize= ->
        setImmediate =>
          @setObjectState "inited"
        return true
      inherits TestObject1, RefObject
      obj = AbstractObject.create(TestObject1)
      obj.on 'inited', ->
        done()
    describe "Object State Events", ->
      it 'should emit the "inited" event', (done)->
          obj = AbstractObject.create(TestObject)
          obj.on 'inited', ->
            done()
      it 'should emit the "destroying" event', (done)->
          obj = AbstractObject.create(TestObject)
          obj.on 'destroying', ->
            done()
          obj.free()
      it 'should emit the "destroyed" event', (done)->
          obj = AbstractObject.create(TestObject)
          obj.on 'destroyed', ->
            done()
          obj.free()
    describe "finalization method", ->
      it 'should pass options to finalize method when free(options)', ->
          obj = AbstractObject.create(TestObject)
          opts = test:123,a:2
          obj.free(opts, "hi", 23)
          obj.finalize.should.be.calledWith opts, "hi", 23
    describe "initialization method", ->
      it 'should pass the arguments into the initialization method', (done)->
        class TestObject2
          inherits TestObject2, RefObject
          initialize:->
            arguments.should.have.length(3)
            arguments.should.have.property '0', 'abc'
            arguments.should.have.property '1', '321'
            arguments.should.have.property '2', 456
            done()
        obj = AbstractObject.create(TestObject2, 'abc', '321', 456)
      it 'should call the initialization method when overriding the constructor method', (done)->
        class TestObject2
          inherits TestObject2, RefObject
          constructor: ->
            super
          initialize:->
            arguments.should.have.length(3)
            arguments.should.have.property '0', 'abc'
            arguments.should.have.property '1', '321'
            arguments.should.have.property '2', 456
            done()
        obj = AbstractObject.create(TestObject2, 'abc', '321', 456)
    describe "addRef", ->
      it 'should not free instance when RefCount > 0', (done)->
        obj = AbstractObject.create(TestObject)
        obj.on 'destroying', ->
          i.should.equal 0
          if i > 0
            done("err")
          else
            done()
        i = obj.addRef()
        obj.RefCount.should.be.equal i
        obj.free()
        i--
        obj.RefCount.should.be.equal i
        obj.free()

