const {
  isArray, isString, isObject
} = require('core-util-is')
const {error} = require('./error')

const STACK = Symbol('dark-hole:stack')
const START = Symbol('dark-hole:start')

const LENGTH = Symbol('dark-hole:length')
const ACCESS = Symbol('dark-hole:access')
const CALL = Symbol('dark-hole:call')

const THIS_ARG = 'thisArg'
const RETURNS_TRUE = () => true

const propTrace = property => ({
  type: 'PropertyAccess',
  property
})

const callTrace = (args, thisArg) => ({
  type: 'FunctionCall',
  args,
  thisArg
})

const arrayEqual = (target, expect) =>
  target.length === expect.length
  && expect.every((arg, i) => arg === target[i])

const createThisArgTester = thisArg =>
  expect => thisArg === expect

const MATCHER = {
  PropertyAccess ({
    property
  }, {
    property: expectProperty
  }) {
    return property === expectProperty
  },

  FunctionCall (target, expect) {
    return arrayEqual(target.args, expect.args)
    // expect.thisArg is a function
    && expect.thisArg(target.thisArg)
  }
}

const matchTrace = (target, expect) =>
  target.type === expect.type
  && MATCHER[expect.type](target, expect)

const matchTraces = (traces, expect, start) =>
  expect.every((ex, i) => matchTrace(traces[start + i], ex))

const parseAccessor = accessor => {
  if (accessor === undefined) {
    return []
  }

  if (isString(accessor)) {
    return accessor.split('.')
  }

  if (!isArray(accessor) || !accessor.every(isString)) {
    throw error('INVALID_ACCESSOR', accessor)
  }

  return accessor
}

const createTracesByAccessor = accessor =>
  parseAccessor(accessor).map(propTrace)

const checkOptions = options => {
  if (!isObject(options)) {
    throw error('INVALID_OPTIONS', options)
  }
}

class Tracer {
  constructor (stack, start = 0) {
    this[STACK] = stack
    this[START] = start
    this[LENGTH] = stack.length
  }

  // Extend new trace to the tracer
  _extend (trace) {
    return new Tracer(this[STACK].concat(trace))
  }

  [ACCESS] (property) {
    return this._extend(propTrace(property))
  }

  [CALL] (args, thisArg) {
    return this._extend(callTrace(args, thisArg))
  }

  get [Symbol.iterator] () {
    const stack = this[STACK]
    return stack[Symbol.iterator].bind(stack)
  }

  get ended () {
    return this[STACK].length === 0
  }

  _matchTraces (expect, start, immediately) {
    const {length} = expect

    if (start + length > this[LENGTH]) {
      return - 1
    }

    const matched = matchTraces(this[STACK], expect, start)

    if (matched || immediately) {
      return matched
        ? start
        : - 1
    }

    return this._matchTraces(expect, start + 1, false)
  }

  _match (expect, immediately) {
    const start = this._matchTraces(expect, 0, immediately)

    if (start !== - 1) {
      const newStart = start + expect.length
      return new Tracer(this[STACK].slice(newStart), newStart)
    }

    throw error('NO_MATCH')
  }

  willBeCalledWith (options) {
    checkOptions(options)

    const {
      accessor,
      args = [],
      immediately
    } = options

    const thisArg = THIS_ARG in options
      ? createThisArgTester(options.thisArg)
      : RETURNS_TRUE

    const expect = createTracesByAccessor(accessor)
    .concat(callTrace(args, thisArg))

    return this._match(expect, immediately)
  }

  willBeAccessedBy (options) {
    checkOptions(options)

    const {
      accessor,
      immediately
    } = options

    const expect = createTracesByAccessor(accessor)
    return this._match(expect, immediately)
  }
}

const trace = proxy => proxy[STACK]

module.exports = {
  STACK,
  ACCESS,
  CALL,
  trace,
  Tracer
}
