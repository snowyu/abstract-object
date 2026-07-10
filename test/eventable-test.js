import {describe, it, expect, vi} from 'vitest'

import {inherits} from 'inherits-ex'
import createObject from 'inherits-ex/lib/createObject'
import {eventable} from 'events-ex'


import AbstractObject from '../src/abstract-object'

describe('eventable', function() {
  describe('eventable index', function() {
    it('should be eventable class', function() {
      function MyClass() {}

      inherits(MyClass, AbstractObject);
      eventable(MyClass);
      expect(MyClass.prototype).to.have.property('setObjectState')

      const my = new MyClass;
      const onDestroyed = vi.fn();
      my.on('destroyed', onDestroyed);
      my.free();
      expect(onDestroyed).toHaveBeenCalledTimes(1);
    });
    it('should use the internal eventable of AbstractObject and no duplication inject', function() {
      return new Promise((resolve) => {
        function MyClass() {
          MyClass.__super__.constructor.apply(this, arguments);
        }
        inherits(MyClass, AbstractObject);
        // duplication inject found here:
        eventable(MyClass);
        expect(MyClass.prototype).to.have.property('setObjectState')

        MyClass.prototype.initialize = function() {
          setImmediate((function(_this) {
            return function() {
              _this.setObjectState("inited");
            };
          })(this));
          return true;
        };

        createObject(MyClass).on('inited', function() {
          resolve();
        });
      });
    });
  });
});
