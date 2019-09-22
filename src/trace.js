const {
  isArray, isString
} = require('core-util-is')

const {error} = require('./error')

const STACK = Symbol('dark-hole:stack')
const ACCESS = Symbol('dark-hole:access')
const CALL = Symbol('dark-hole:call')

const propTrace = property => ({
  type: 'PropertyAccess',
  property
})

const callTrace = (args, thisObject) => ({
  type: 'FunctionCall',
  args,
  thisObject
})

const arrayEqual = (target, expect) =>
  expect.every((arg, i) => arg === target[i])

const MATCHER = {
  PropertyAccess ({
    property
  }, {
    property: expectProperty
  }) {
    return property === expectProperty
  },

  FunctionCall (target, expect) {

  }
}

const parseAccessor = accessor => {
  if (accessor === undefined) {
    return []
  }

  if (isString(accessor)) {
    return accessor.split('.')
  }

  if (!isArray(accessor) || !accessor.every(isString)) {
    throw error('INVALID_ACCESSOR')
  }

  return accessor
}

const createTracesByAccessor = accessor =>
  parseAccessor(accessor).map(propTrace)

class Tracer {
  constructor (stack) {
    this[STACK] = stack
  }

  _create (trace) {
    return new Tracer(this[STACK].concat(trace))
  }

  [ACCESS] (property) {
    return this._create(propTrace(property))
  }

  [CALL] (args, thisObject) {
    return this._create(callTrace(args, thisObject))
  }

  get [Symbol.iterator] () {
    return this[STACK][Symbol.iterator]
  }

  _next (ofIndex) {
    return new Tracer(this[STACK].slice(ofIndex + 1))
  }

  get done () {
    return this[STACK].length === 0
  }

  _isMatchTraces (traces, start, lookAhead) {

  }

  _willBeCalledWith (options) {

  }

  willBeCalledWith ({
    accessor,
    args,
    thisObject,
    begin = true
  }) {
    if (accessor) {
      return this.willBeAccessedBy({
        accessor,
        begin
      })
      .willBeCalledWith({
        args,
        thisObject,
        begin: true
      })
    }

    const current = this[STACK][0]
  }

  willBeAccessedBy ({
    accessor,
    begin = true
  }) {

  }
}

const trace = proxy => new Tracer(proxy[STACK])

module.exports = {
  STACK,
  ACCESS,
  CALL,
  trace,
  Tracer
}
