import {describe, it, expect, vi} from 'vitest'

import inherits from 'inherits-ex/lib/inherits'

import {AbstractObject, OBJECT_STATES} from '../src/'


describe("AbstractObject", function() {
  it("should constructor be called", function() {
    class TestObject extends AbstractObject {}
    const obj = new TestObject;
    expect(obj.objectState).to.eq('inited');
  });
  it("should have Class property", function() {
    function TestObject() {}

    inherits(TestObject, AbstractObject);

    expect(TestObject.prototype).to.have.property('Class', TestObject);
  });

  describe("Object State methods", function() {
    it('.isIniting()', function() {
      return new Promise((resolve) => {
        class TestObject extends AbstractObject {
          initialize() {
            expect(this.isIniting()).to.be.true;
            resolve();
          }
        }
        const obj = AbstractObject.create(TestObject);
      });
    });
    it('.isInited()', function() {
      class TestObject extends AbstractObject {}

      const obj = AbstractObject.create(TestObject);
      expect(obj.isInited()).to.be.true;
    });

    it('.isDestroying()', function() {
      return new Promise((resolve) => {
        class TestObject extends AbstractObject {
          finalize() {
            expect(this.isDestroying()).to.be.true;
            resolve();
          }
        }

        const obj = new TestObject;
        expect(obj.isInited()).to.be.true;
        obj.free();
      });
    });
    it('.isDestroyed()', function() {
      class TestObject extends AbstractObject {}

      const obj = AbstractObject.create(TestObject);
      expect(obj.isInited()).to.be.true;
      obj.free();
      expect(obj.isDestroyed()).to.be.true;
    });
  });
  describe("finalization method", function() {
    it('should pass options to final method when free(options)', function() {
      class TestObject extends AbstractObject {}

      TestObject.prototype.finalize = vi.fn();

      const obj = AbstractObject.create(TestObject);
      const opts = {
        test: 123,
        a: 2
      };
      obj.free(opts, 32);
      expect(obj.finalize).toHaveBeenCalledWith(opts, 32);
    });
  });
  describe("initialization method", function() {
    it('should pass the arguments into the initialization method', function() {
      return new Promise((resolve) => {
        class TestObject extends AbstractObject {
          initialize() {
            expect(arguments).to.have.length(3);
            expect(arguments).to.have.property('0', 'abc');
            expect(arguments).to.have.property('1', '321');
            expect(arguments).to.have.property('2', 456);
            resolve();
          }
        }

        const obj = new TestObject('abc', '321', 456);
      });
    });
    it('should pass the correct arguments to init', function() {
      class TestObject extends AbstractObject {}
      class A2 extends TestObject {
        initialize(first, second, third) {
          this.first = first;
          this.second = second;
          this.third = third;
          expect(arguments).to.have.length(3);
          expect(arguments).to.have.property('0', 'abc');
          expect(arguments).to.have.property('1', '321');
          expect(arguments).to.have.property('2', 456);
        }
      }

      const obj = new A2('abc', '321', 456);
      expect(obj).to.have.property('first', 'abc');
      expect(obj).to.have.property('second', '321');
      expect(obj).to.have.property('third', 456);
    });
  });
});
