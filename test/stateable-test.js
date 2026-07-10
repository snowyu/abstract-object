import {describe, it, expect} from 'vitest'

import {inherits} from 'inherits-ex'

import {stateable, OBJECT_STATES} from '../src/'

describe('stateable', () => {
  it('should be inited', () => {
    class A {
      constructor() {
        this._constructor(...arguments)
      }
    }
    stateable(A)
    const obj = new A;
    expect(obj.objectState).to.eq('inited');
  });
  it('should call the initialize method', () => {
    class A {
      constructor() {
        this._constructor(...arguments)
      }
      initialize() {
        this.initialized = 1886
      }
    }
    stateable(A)
    const obj = new A;
    expect(obj.objectState).to.eq('inited');
    expect(obj.initialized).to.eq(1886);
  });
  it('.isIniting()', function() {
    let isIniting
    class TestObject {
      constructor() {
        this._constructor(...arguments)
      }
      initialize() {
        isIniting = this.isIniting()
      }
    }
    stateable(TestObject)
    new TestObject
    expect(isIniting).to.be.true
  });

});
