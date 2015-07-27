chai            = require 'chai'
sinon           = require 'sinon'
sinonChai       = require 'sinon-chai'
assert          = chai.assert
should          = chai.should()

inherits        = require 'inherits-ex'
log             = require 'util-ex/lib/log'
createObject    = require 'inherits-ex/lib/createObject'
AbstractObject  = require '../'

chai.use(sinonChai)

describe 'eventable', ->

  describe 'eventable index', ->
    it 'should be eventable class', ->
      eventable = require 'events-ex/eventable'
      class MyClass
        inherits MyClass, AbstractObject
        eventable MyClass
      my = new MyClass
      onDestroyed = sinon.spy()
      my.on 'destroyed', onDestroyed
      my.free()
      onDestroyed.should.have.been.calledOnce

    it 'should use the internal eventable of AbstractObject and no duplication inject', (done)->
      eventable  = require '../src/eventable'
      class MyClass
        inherits MyClass, AbstractObject
        eventable MyClass
        constructor:->super
        initialize: ->
          setImmediate =>
            @setObjectState "inited"
          return true
      createObject(MyClass).on 'inited', ->
        done()
