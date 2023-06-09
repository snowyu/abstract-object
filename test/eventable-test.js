import chai, {assert, expect} from 'chai'
import sinon from 'sinon'
import sinonChai from 'sinon-chai'

// const assert = chai.assert;
const should = chai.should();

import {inherits} from 'inherits-ex'
import log from 'util-ex/lib/log'
import createObject from 'inherits-ex/lib/createObject'
// import {eventable} from '../src/eventable'
import {eventable} from 'events-ex'


import AbstractObject from '../src/abstract-object'

chai.use(sinonChai);

describe('eventable', function() {
  describe('eventable index', function() {
    it('should be eventable class', function() {
      function MyClass() {}

      inherits(MyClass, AbstractObject);
      eventable(MyClass);
      expect(MyClass.prototype).to.ownProperty('setObjectState')

      const my = new MyClass;
      const onDestroyed = sinon.spy();
      my.on('destroyed', onDestroyed);
      my.free();
      onDestroyed.should.have.been.calledOnce;
    });
    it('should use the internal eventable of AbstractObject and no duplication inject', function(done) {
      function MyClass() {
        MyClass.__super__.constructor.apply(this, arguments);
      }
      inherits(MyClass, AbstractObject);
      // duplication inject found here:
      eventable(MyClass);
      expect(MyClass.prototype).to.ownProperty('setObjectState')

      MyClass.prototype.initialize = function() {
        setImmediate((function(_this) {
          return function() {
            _this.setObjectState("inited");
          };
        })(this));
        return true;
      };

      createObject(MyClass).on('inited', function() {
        done();
      });
    });
  });
});
