chai            = require 'chai'
sinon           = require 'sinon'
sinonChai       = require 'sinon-chai'
should          = chai.should()
expect          = chai.expect
#AbstractObject  = require '../index'
AbstractObject  = require '../src/Object'
Errors          = require '../Error'
util            = require '../lib/util'
inherits        = util.inherits
setImmediate    = setImmediate || process.nextTick

chai.use(sinonChai)

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
      it 'should pass the correct arguments to init', ->
        class TestObject
          inherits TestObject, AbstractObject
        class A2
          inherits A2, TestObject
          constructor: ->
            if not (this instanceof A2)
              return AbstractObject.createWith(A2, arguments)
            super
          init:(@first, @second, @third)->
            arguments.should.have.length(3)
            arguments.should.have.property '0', 'abc'
            arguments.should.have.property '1', '321'
            arguments.should.have.property '2', 456
        obj = A2('abc', '321', 456)
        obj.should.have.property 'first', 'abc'
        obj.should.have.property 'second', '321'
        obj.should.have.property 'third', 456
    describe ".dispatchError", ->
      NotFoundError = Errors.NotFoundError
      err = new NotFoundError('FallingError')
      class TestObject
        inherits TestObject, AbstractObject
        init:(@first, @second, @third)->
      it 'should callback error only when callback exists and return nothing', ->
        obj = AbstractObject.create(TestObject, 1,2,3)
        onErrorEvent = sinon.spy()
        cb = sinon.spy()
        obj.on 'error', onErrorEvent
        obj.should.contain.keys('first', 'second', 'third')
        obj.dispatchError err, cb
        #calledWithArguments:
        cb.should.have.been.calledWith(err)
        cb.should.have.been.calledOnce
        #cb.should.have.been.callCount(1)
        cb.should.have.returned(undefined)
        onErrorEvent.should.have.not.been.called

      it 'should callback and emit error when callback exists and return false', ->
        obj = AbstractObject.create(TestObject, 1,2,3)
        onErrorEvent = sinon.spy()
        cb = sinon.spy.create(->false)
        obj.on 'error', onErrorEvent
        obj.should.contain.keys('first', 'second', 'third')
        obj.dispatchError err, cb
        cb.should.have.been.calledWith(err)
        cb.should.have.been.calledOnce
        cb.should.have.returned(false)
        onErrorEvent.should.have.been.callCount(1)
        onErrorEvent.should.have.been.calledWith(err)

      it 'should emit error when callback not exists', (done)->
        obj = AbstractObject.create(TestObject, 1,2,3)
        obj.on 'error', (aErr)->
          expect(aErr).to.equal err
          done()
        obj.should.contain.keys('first', 'second', 'third')
        obj.dispatchError err
    describe ".dispatch", ->
      err = 'DispatchError'
      class TestObject
        inherits TestObject, AbstractObject
        init:(@first, @second, @third)->
      it 'should callback only when callback exists and return nothing', ->
        obj = AbstractObject.create(TestObject, 1,2,3)
        onErrorEvent = sinon.spy()
        cb = sinon.spy()
        obj.on 'error', onErrorEvent
        obj.should.contain.keys('first', 'second', 'third')
        obj.dispatch 'error', err, cb
        #calledWithArguments:
        cb.should.have.been.calledWith(err)
        cb.should.have.been.calledOnce
        #cb.should.have.been.callCount(1)
        cb.should.have.returned(undefined)
        onErrorEvent.should.have.not.been.called

      it 'should callback and emit event when callback exists and return false', ->
        obj = AbstractObject.create(TestObject, 1,2,3)
        onErrorEvent = sinon.spy()
        cb = sinon.spy.create(->false)
        obj.on 'error', onErrorEvent
        obj.should.contain.keys('first', 'second', 'third')
        obj.dispatch 'error', err, cb
        cb.should.have.been.calledWith(err)
        cb.should.have.been.calledOnce
        cb.should.have.returned(false)
        onErrorEvent.should.have.been.callCount(1)
        onErrorEvent.should.have.been.calledWith(err)

      it 'should emit event when callback not exists', (done)->
        obj = AbstractObject.create(TestObject, 1,2,3)
        obj.on 'error', (aErr)->
          expect(aErr).to.equal err
          done()
        obj.should.contain.keys('first', 'second', 'third')
        obj.dispatch 'error', err
      it 'should callback only when callback exists and return nothing with no arguments', ->
        obj = AbstractObject.create(TestObject, 1,2,3)
        onErrorEvent = sinon.spy()
        cb = sinon.spy()
        obj.on 'error', onErrorEvent
        obj.should.contain.keys('first', 'second', 'third')
        obj.dispatch 'error', cb
        #calledWithArguments:
        #cb.should.have.been.calledWith(err)
        cb.should.have.been.calledOnce
        #cb.should.have.been.callCount(1)
        cb.should.have.returned(undefined)
        onErrorEvent.should.have.not.been.called

      it 'should callback only when callback exists and return nothing with two arguments', ->
        obj = AbstractObject.create(TestObject, 1,2,3)
        onErrorEvent = sinon.spy()
        cb = sinon.spy()
        obj.on 'error', onErrorEvent
        obj.should.contain.keys('first', 'second', 'third')
        obj.dispatch 'error', [err, 12], cb
        #calledWithArguments:
        cb.should.have.been.calledWith(err, 12)
        cb.should.have.been.calledOnce
        #cb.should.have.been.callCount(1)
        cb.should.have.returned(undefined)
        onErrorEvent.should.have.not.been.called

      it 'should callback and emit event when callback exists and return false with two arguments', ->
        obj = AbstractObject.create(TestObject, 1,2,3)
        onErrorEvent = sinon.spy()
        cb = sinon.spy.create(->false)
        obj.on 'error', onErrorEvent
        obj.should.contain.keys('first', 'second', 'third')
        obj.dispatch 'error', [err, 451], cb
        cb.should.have.been.calledWith(err, 451)
        cb.should.have.been.calledOnce
        cb.should.have.returned(false)
        onErrorEvent.should.have.been.callCount(1)
        onErrorEvent.should.have.been.calledWith(err)


