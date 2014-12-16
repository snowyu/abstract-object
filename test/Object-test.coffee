chai            = require 'chai'
should          = chai.should()
AbstractObject  = require '../index'
util            = require '../lib/util'
inherits        = util.inherits
setImmediate    = setImmediate || process.nextTick

describe "AbstractObject", ->
    #before (done)->
    #after (done)->
    it "AbstractObject constructor should be called", (done)->
      TestObject = ->
      TestObject::init= ->
        setImmediate =>
          @setObjectState "inited"
        return true
      inherits TestObject, AbstractObject
      obj = AbstractObject.create(TestObject)
      obj.on 'inited', ->
        done()
    describe "Object State Events", ->
      it 'should emit the "inited" event', (done)->
          class TestObject
            inherits TestObject, AbstractObject
            init: ->
              setImmediate =>
                @setObjectState "inited"
              return true
          obj = AbstractObject.create(TestObject)
          obj.on 'inited', ->
            done()
      it 'should emit the "destroying" event', (done)->
          class TestObject
            inherits TestObject, AbstractObject
          obj = AbstractObject.create(TestObject)
          obj.on 'destroying', ->
            done()
          obj.free()
      it 'should emit the "destroyed" event', (done)->
          class TestObject
            inherits TestObject, AbstractObject
          obj = AbstractObject.create(TestObject)
          obj.on 'destroyed', ->
            done()
          obj.free()
    describe "initialization method", ->
      it 'should pass the arguments into the initialization method', (done)->
        class TestObject
          inherits TestObject, AbstractObject
          init:->
            arguments.should.have.length(3)
            arguments.should.have.property '0', 'abc'
            arguments.should.have.property '1', '321'
            arguments.should.have.property '2', 456
            done()
        obj = AbstractObject.create(TestObject, 'abc', '321', 456)
