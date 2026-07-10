import {describe, it, expect, vi} from 'vitest'

import inherits from 'inherits-ex/lib/inherits'

import EventableObject from '../src/eventable-object'



describe("EventableObject", function() {
  it("should constructor be called", function() {
    return new Promise((resolve) => {
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
        resolve();
      });
    });
  });
  it("should have Class property", function() {
    function TestObject() {}

    inherits(TestObject, EventableObject);

    expect(TestObject.prototype).to.have.property('Class', TestObject);
  });

  describe("Object State methods", function() {
    it('.isIniting()', function() {
      return new Promise((resolve) => {
        function TestObject() {}

        inherits(TestObject, EventableObject);

        TestObject.prototype.initialize = function() {
          expect(this.isIniting()).to.be.true;
          resolve();
        };
        const obj = EventableObject.create(TestObject);
      });
    });
    it('.isInited()', function() {
      function TestObject() {}

      inherits(TestObject, EventableObject);
      const obj = EventableObject.create(TestObject);
      expect(obj.isInited()).to.be.true;
    });

    it('.isDestroying()', function() {
      return new Promise((resolve) => {
        function TestObject() {}

        inherits(TestObject, EventableObject);

        TestObject.prototype.finalize = function() {
          expect(this.isDestroying()).to.be.true;
          resolve();
        };

        const obj = EventableObject.create(TestObject);
        expect(obj.isInited()).to.be.true;
        obj.free();
      });
    });
    it('.isDestroyed()', function() {
      function TestObject() {}

      inherits(TestObject, EventableObject);

      const obj = EventableObject.create(TestObject);
      expect(obj.isInited()).to.be.true;
      obj.free();
      expect(obj.isDestroyed()).to.be.true;
    });
  });
  describe("Object State Events", function() {
    it('should emit the "inited" event', function() {
      return new Promise((resolve) => {
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
          resolve();
        });
      });
    });
    it('should emit the "destroying" event', function() {
      return new Promise((resolve) => {
        function TestObject() {}

        inherits(TestObject, EventableObject);

        const obj = EventableObject.create(TestObject);
        obj.on('destroying', function() {
          resolve();
        });
        obj.free();
      });
    });
    it('should emit the "destroyed" event', function() {
      return new Promise((resolve) => {
        function TestObject() {}

        inherits(TestObject, EventableObject);

        const obj = EventableObject.create(TestObject);
        obj.on('destroyed', function() {
          resolve();
        });
        obj.free();
      });
    });
  });
  describe("finalization method", function() {
    it('should pass options to final method when free(options)', function() {
      function TestObject() {}

      inherits(TestObject, EventableObject);

      TestObject.prototype.finalize = vi.fn();

      const obj = EventableObject.create(TestObject);
      const opts = {
        test: 123,
        a: 2
      };
      obj.free(opts, 32);
      expect(obj.finalize).toHaveBeenCalledWith(opts, 32);
    });
    it('should remove all event listeners after free', function() {
      function TestObject() {}

      inherits(TestObject, EventableObject);

      const obj = EventableObject.create(TestObject);
      obj.on('destroyed', function() {});
      obj.on('destroyed', function() {
        return "dd";
      });
      expect(obj.listeners('destroyed')).to.have.length(2);
      obj.free();
      expect(obj.listeners('destroyed')).to.have.length(0);
    });
  });
  describe("initialization method", function() {
    it('should pass the arguments into the initialization method', function() {
      return new Promise((resolve) => {
        function TestObject() {}

        inherits(TestObject, EventableObject);

        TestObject.prototype.initialize = function() {
          expect(arguments).to.have.length(3);
          expect(arguments).to.have.property('0', 'abc');
          expect(arguments).to.have.property('1', '321');
          expect(arguments).to.have.property('2', 456);
          resolve();
        };

        const obj = EventableObject.create(TestObject, 'abc', '321', 456);
      });
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
        expect(arguments).to.have.length(3);
        expect(arguments).to.have.property('0', 'abc');
        expect(arguments).to.have.property('1', '321');
        expect(arguments).to.have.property('2', 456);
      };

      const obj = A2('abc', '321', 456);
      expect(obj).to.have.property('first', 'abc');
      expect(obj).to.have.property('second', '321');
      expect(obj).to.have.property('third', 456);
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
      const onErrorEvent = vi.fn();
      const cb = vi.fn();
      obj.on('error', onErrorEvent);
      expect(obj).to.contain.keys('first', 'second', 'third');
      obj.dispatchError(err, cb);
      expect(cb).toHaveBeenCalledWith(err);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveReturnedWith(undefined);
      expect(onErrorEvent).not.toHaveBeenCalled();
    });
    it('should callback and emit error when callback exists and return false', function() {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      const onErrorEvent = vi.fn();
      const cb = vi.fn(function() {
        return false;
      });
      obj.on('error', onErrorEvent);
      expect(obj).to.contain.keys('first', 'second', 'third');
      obj.dispatchError(err, cb);
      expect(cb).toHaveBeenCalledWith(err);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveReturnedWith(false);
      expect(onErrorEvent).toHaveBeenCalledTimes(1);
      expect(onErrorEvent).toHaveBeenCalledWith(err);
    });
    it('should emit error when callback not exists', function() {
      return new Promise((resolve) => {
        const obj = EventableObject.create(TestObject, 1, 2, 3);
        obj.on('error', function(aErr) {
          expect(aErr).to.equal(err);
          resolve();
        });
        expect(obj).to.contain.keys('first', 'second', 'third');
        obj.dispatchError(err);
      });
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
      const onErrorEvent = vi.fn();
      const cb = vi.fn();
      obj.on('error', onErrorEvent);
      expect(obj).to.contain.keys('first', 'second', 'third');
      obj.dispatch('error', err, cb);
      expect(cb).toHaveBeenCalledWith(err);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveReturnedWith(undefined);
      expect(onErrorEvent).not.toHaveBeenCalled();
    });
    it('should callback and emit event when callback exists and return false', function() {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      const onErrorEvent = vi.fn();
      const cb = vi.fn(function() {
        return false;
      });
      obj.on('error', onErrorEvent);
      expect(obj).to.contain.keys('first', 'second', 'third');
      obj.dispatch('error', err, cb);
      expect(cb).toHaveBeenCalledWith(err);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveReturnedWith(false);
      expect(onErrorEvent).toHaveBeenCalledTimes(1);
      expect(onErrorEvent).toHaveBeenCalledWith(err);
    });
    it('should emit event when callback not exists', function() {
      return new Promise((resolve) => {
        const obj = EventableObject.create(TestObject, 1, 2, 3);
        obj.on('error', function(aErr) {
          expect(aErr).to.equal(err);
          resolve();
        });
        expect(obj).to.contain.keys('first', 'second', 'third');
        obj.dispatch('error', err);
      });
    });
    it('should callback only when callback exists and return nothing with no arguments', function() {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      const onErrorEvent = vi.fn();
      const cb = vi.fn();
      obj.on('error', onErrorEvent);
      expect(obj).to.contain.keys('first', 'second', 'third');
      obj.dispatch('error', cb);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveReturnedWith(undefined);
      expect(onErrorEvent).not.toHaveBeenCalled();
    });
    it('should callback only when callback exists and return nothing with two arguments', function() {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      const onErrorEvent = vi.fn();
      const cb = vi.fn();
      obj.on('error', onErrorEvent);
      expect(obj).to.contain.keys('first', 'second', 'third');
      obj.dispatch('error', [err, 12], cb);
      expect(cb).toHaveBeenCalledWith(err, 12);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveReturnedWith(undefined);
      expect(onErrorEvent).not.toHaveBeenCalled();
    });
    it('should callback and emit event when callback exists and return false with two arguments', function() {
      const obj = EventableObject.create(TestObject, 1, 2, 3);
      const onErrorEvent = vi.fn();
      const cb = vi.fn(function() {
        return false;
      });
      obj.on('error', onErrorEvent);
      expect(obj).to.contain.keys('first', 'second', 'third');
      obj.dispatch('error', [err, 451], cb);
      expect(cb).toHaveBeenCalledWith(err, 451);
      expect(cb).toHaveBeenCalledTimes(1);
      expect(cb).toHaveReturnedWith(false);
      expect(onErrorEvent).toHaveBeenCalledTimes(1);
      expect(onErrorEvent).toHaveBeenCalledWith(err, 451);
    });
  });
});
