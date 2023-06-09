import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

const should = chai.should();
const expect = chai.expect;
chai.use(sinonChai);

import inherits from 'inherits-ex/lib/inherits'

import EventableObject from '../src/eventable-object'



describe("EventableObject", function() {
  it("should constructor be called", function(done) {
    const TestObject = function() {};
    TestObject.prototype.initialize = function() {
      setImmediate((function(_this) {
        return function() {
          return _this.setObjectState("inited");
        };
      })(this));
      return true;
    };
    inherits(TestObject, EventableObject);
    const obj = EventableObject.create(TestObject);
    obj.on('inited', function() {
      done();
    });
  });
  it("should have Class property", function() {
    function TestObject() {}

    inherits(TestObject, EventableObject);

    TestObject.prototype.should.have.property('Class', TestObject);
  });

  describe("Object State methods", function() {
    it('.isIniting()', function(done) {
      function TestObject() {}

      inherits(TestObject, EventableObject);

      TestObject.prototype.initialize = function() {
        this.isIniting().should.be["true"];
        done();
      };
      const obj = EventableObject.create(TestObject);
    });
    it('.isInited()', function() {
      function TestObject() {}

      inherits(TestObject, EventableObject);
      const obj = EventableObject.create(TestObject);
      obj.isInited().should.be["true"];
    });

    it('.isDestroying()', function(done) {
      function TestObject() {}

      inherits(TestObject, EventableObject);

      TestObject.prototype.finalize = function() {
        this.isDestroying().should.be["true"];
        return done();
      };

      const obj = EventableObject.create(TestObject);
      obj.isInited().should.be["true"];
      obj.free();
    });
    it('.isDestroyed()', function() {
      function TestObject() {}

      inherits(TestObject, EventableObject);

      const obj = EventableObject.create(TestObject);
      obj.isInited().should.be["true"];
      obj.free();
      obj.isDestroyed().should.be["true"];
    });
  });
  describe("Object State Events", function() {
    it('should emit the "inited" event', function(done) {
      function TestObject() {}

      inherits(TestObject, EventableObject);

      TestObject.prototype.initialize = function() {
        setImmediate((function(_this) {
          return function() {
            return _this.setObjectState("inited");
          };
        })(this));
        return true;
      };

      const obj = EventableObject.create(TestObject);
      obj.on('inited', function() {
        done();
      });
    });
    it('should emit the "destroying" event', function(done) {
      function TestObject() {}

      inherits(TestObject, EventableObject);

      const obj = EventableObject.create(TestObject);
      obj.on('destroying', function() {
        done();
      });
      obj.free();
    });
    it('should emit the "destroyed" event', function(done) {
      function TestObject() {}

      inherits(TestObject, EventableObject);

      const obj = EventableObject.create(TestObject);
      obj.on('destroyed', function() {
        done();
      });
      obj.free();
    });
  });
  describe("finalization method", function() {
    it('should pass options to final method when free(options)', function() {
      function TestObject() {}

      inherits(TestObject, EventableObject);

      TestObject.prototype.finalize = sinon.spy();

      const obj = EventableObject.create(TestObject);
      const opts = {
        test: 123,
        a: 2
      };
      obj.free(opts, 32);
      obj.finalize.should.be.calledWith(opts, 32);
    });
    it('should remove all event listeners after free', function() {
      function TestObject() {}

      inherits(TestObject, EventableObject);

      const obj = EventableObject.create(TestObject);
      obj.on('destroyed', function() {});
      obj.on('destroyed', function() {
        return "dd";
      });
      obj.listeners('destroyed').should.be.length(2);
      obj.free();
      obj.listeners('destroyed').should.be.length(0);
    });
  });
  describe("initialization method", function() {
    it('should pass the arguments into the initialization method', function(done) {
      function TestObject() {}

      inherits(TestObject, EventableObject);

      TestObject.prototype.initialize = function() {
        arguments.should.have.length(3);
        arguments.should.have.property('0', 'abc');
        arguments.should.have.property('1', '321');
        arguments.should.have.property('2', 456);
        done();
      };

      const obj = EventableObject.create(TestObject, 'abc', '321', 456);
    });
    it('should pass the correct arguments to init', function() {
      function TestObject() {}

      inherits(TestObject, EventableObject);

      function A2() {
        if (!(this instanceof A2)) {
          return EventableObject.createWith(A2, arguments);
        }
        A2.__super__.constructor.apply(this, arguments);
      }
      inherits(A2, TestObject);

      A2.prototype.initialize = function(first, second, third) {
        this.first = first;
        this.second = second;
        this.third = third;
        arguments.should.have.length(3);
        arguments.should.have.property('0', 'abc');
        arguments.should.have.property('1', '321');
        return arguments.should.have.property('2', 456);
      };

      const obj = A2('abc', '321', 456);
      obj.should.have.property('first', 'abc');
      obj.should.have.property('second', '321');
      obj.should.have.property('third', 456);
    });
  });
  describe(".dispatchError", function() {
    const NotFoundError = Error;
    const err = new NotFoundError('FallingError');
    function TestObject() {}

    inherits(TestObject, EventableObject);

    TestObject.prototype.initialize = function(first, second, third) {
      this.first = first;
      this.second = second;
      this.third = third;
    };

    it('should callback error only when callback exists and return nothing', function() {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      const onErrorEvent = sinon.spy();
      const cb = sinon.spy();
      obj.on('error', onErrorEvent);
      obj.should.contain.keys('first', 'second', 'third');
      obj.dispatchError(err, cb);
      cb.should.have.been.calledWith(err);
      cb.should.have.been.calledOnce;
      cb.should.have.returned(void 0);
      onErrorEvent.should.have.not.been.called;
    });
    it('should callback and emit error when callback exists and return false', function() {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      const onErrorEvent = sinon.spy();
      const cb = sinon.spy(function() {
        return false;
      });
      obj.on('error', onErrorEvent);
      obj.should.contain.keys('first', 'second', 'third');
      obj.dispatchError(err, cb);
      cb.should.have.been.calledWith(err);
      cb.should.have.been.calledOnce;
      cb.should.have.returned(false);
      onErrorEvent.should.have.been.callCount(1);
      onErrorEvent.should.have.been.calledWith(err);
    });
    it('should emit error when callback not exists', function(done) {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      obj.on('error', function(aErr) {
        expect(aErr).to.equal(err);
        return done();
      });
      obj.should.contain.keys('first', 'second', 'third');
      obj.dispatchError(err);
    });
  });
  describe(".dispatch", function() {
    const err = 'DispatchError';
    function TestObject() {}

    inherits(TestObject, EventableObject);

    TestObject.prototype.initialize = function(first, second, third) {
      this.first = first;
      this.second = second;
      this.third = third;
    };

    it('should callback only when callback exists and return nothing', function() {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      const onErrorEvent = sinon.spy();
      const cb = sinon.spy();
      obj.on('error', onErrorEvent);
      obj.should.contain.keys('first', 'second', 'third');
      obj.dispatch('error', err, cb);
      cb.should.have.been.calledWith(err);
      cb.should.have.been.calledOnce;
      cb.should.have.returned(void 0);
      onErrorEvent.should.have.not.been.called;
    });
    it('should callback and emit event when callback exists and return false', function() {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      const onErrorEvent = sinon.spy();
      const cb = sinon.spy(function() {
        return false;
      });
      obj.on('error', onErrorEvent);
      obj.should.contain.keys('first', 'second', 'third');
      obj.dispatch('error', err, cb);
      cb.should.have.been.calledWith(err);
      cb.should.have.been.calledOnce;
      cb.should.have.returned(false);
      onErrorEvent.should.have.been.callCount(1);
      onErrorEvent.should.have.been.calledWith(err);
    });
    it('should emit event when callback not exists', function(done) {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      obj.on('error', function(aErr) {
        expect(aErr).to.equal(err);
        done();
      });
      obj.should.contain.keys('first', 'second', 'third');
      obj.dispatch('error', err);
    });
    it('should callback only when callback exists and return nothing with no arguments', function() {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      const onErrorEvent = sinon.spy();
      const cb = sinon.spy();
      obj.on('error', onErrorEvent);
      obj.should.contain.keys('first', 'second', 'third');
      obj.dispatch('error', cb);
      cb.should.have.been.calledOnce;
      cb.should.have.returned(void 0);
      onErrorEvent.should.have.not.been.called;
    });
    it('should callback only when callback exists and return nothing with two arguments', function() {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      const onErrorEvent = sinon.spy();
      const cb = sinon.spy();
      obj.on('error', onErrorEvent);
      obj.should.contain.keys('first', 'second', 'third');
      obj.dispatch('error', [err, 12], cb);
      cb.should.have.been.calledWith(err, 12);
      cb.should.have.been.calledOnce;
      cb.should.have.returned(void 0);
      onErrorEvent.should.have.not.been.called;
    });
    it('should callback and emit event when callback exists and return false with two arguments', function() {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      const onErrorEvent = sinon.spy();
      const cb = sinon.spy(function() {
        return false;
      });
      obj.on('error', onErrorEvent);
      obj.should.contain.keys('first', 'second', 'third');
      obj.dispatch('error', [err, 451], cb);
      cb.should.have.been.calledWith(err, 451);
      cb.should.have.been.calledOnce;
      cb.should.have.returned(false);
      onErrorEvent.should.have.been.callCount(1);
      onErrorEvent.should.have.been.calledWith(err);
    });
  });
});
