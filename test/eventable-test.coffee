chai            = require 'chai'
sinon           = require 'sinon'
sinonChai       = require 'sinon-chai'
assert          = chai.assert
should          = chai.should()

inherits        = require 'inherits-ex'
log             = require 'util-ex/lib/log'
AbstractObject  = require '../'

chai.use(sinonChai)

describe 'eventable', ->
  describe 'eventable index', ->
    eventable = require 'events-ex/eventable'
    it 'should be eventable class', ->
      class MyClass
        inherits MyClass, AbstractObject
        eventable MyClass
      my = new MyClass
      onDestroyed = sinon.spy()
      my.on 'destroyed', onDestroyed
      my.free()
      onDestroyed.should.have.been.calledOnce

