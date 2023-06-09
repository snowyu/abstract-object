import chai from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

const should = chai.should();
const expect = chai.expect;
chai.use(sinonChai);

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

    TestObject.prototype.should.have.property('Class', TestObject);
  });

  describe("Object State methods", function() {
    it('.isIniting()', function(done) {
      class TestObject extends AbstractObject {
        initialize() {
          this.isIniting().should.be["true"];
          done();
        }
      }
      const obj = AbstractObject.create(TestObject);
    });
    it('.isInited()', function() {
      class TestObject extends AbstractObject {}

      const obj = AbstractObject.create(TestObject);
      obj.isInited().should.be["true"];
    });

    it('.isDestroying()', function(done) {
      class TestObject extends AbstractObject {
        finalize() {
          this.isDestroying().should.be["true"];
          return done();
        }
      }

      const obj = new TestObject;
      obj.isInited().should.be["true"];
      obj.free();
    });
    it('.isDestroyed()', function() {
      class TestObject extends AbstractObject {}

      const obj = AbstractObject.create(TestObject);
      obj.isInited().should.be["true"];
      obj.free();
      obj.isDestroyed().should.be["true"];
    });
  });
  describe("finalization method", function() {
    it('should pass options to final method when free(options)', function() {
      class TestObject extends AbstractObject {}

      TestObject.prototype.finalize = sinon.spy();

      const obj = AbstractObject.create(TestObject);
      const opts = {
        test: 123,
        a: 2
      };
      obj.free(opts, 32);
      obj.finalize.should.be.calledWith(opts, 32);
    });
  });
  describe("initialization method", function() {
    it('should pass the arguments into the initialization method', function(done) {
      class TestObject extends AbstractObject {
        initialize() {
          arguments.should.have.length(3);
          arguments.should.have.property('0', 'abc');
          arguments.should.have.property('1', '321');
          arguments.should.have.property('2', 456);
          done();
        }
      }

      const obj = new TestObject('abc', '321', 456);
    });
    it('should pass the correct arguments to init', function() {
      class TestObject extends AbstractObject {}
      class A2 extends TestObject {
        initialize(first, second, third) {
          this.first = first;
          this.second = second;
          this.third = third;
          arguments.should.have.length(3);
          arguments.should.have.property('0', 'abc');
          arguments.should.have.property('1', '321');
          arguments.should.have.property('2', 456);
        }
      }

      const obj = new A2('abc', '321', 456);
      obj.should.have.property('first', 'abc');
      obj.should.have.property('second', '321');
      obj.should.have.property('third', 456);
    });
  });
});
