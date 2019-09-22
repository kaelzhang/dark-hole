const {
  isArray, isString, isObject
} = require('core-util-is')
const {error} = require('./error')

const STACK = Symbol('dark-hole:stack')
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
  expect.every((arg, i) => arg === target[i])

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
    // target.thisArg is a function
    && target.thisArg(expect.thisArg)
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
    throw error('INVALID_ACCESSOR')
  }

  return accessor
}

const createTracesByAccessor = accessor =>
  parseAccessor(accessor).map(propTrace)

class Tracer {
  constructor (stack) {
    this[STACK] = stack
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
    return this[STACK][Symbol.iterator]
  }

  get done () {
    return this[STACK].length === 0
  }

  _matchTraces (expect, start, lookAhead) {
    const {length} = expect

    if (start + length > this[LENGTH]) {
      return - 1
    }

    const matched = matchTraces(this[STACK], expect, start)

    if (matched || !lookAhead) {
      return matched
        ? start
        : - 1
    }

    return this._matchTraces(expect, start + 1, true)
  }

  _match (expect, begin) {
    const start = this._matchTraces(expect, 0, !begin)

    if (start === - 1) {
      throw error('NOT_MATCH')
    }

    return new Tracer(this[STACK].slice(start + expect.length))
  }

  willBeCalledWith (options) {
    if (!isObject(options)) {
      throw error('INVALID_OPTIONS', options)
    }

    const {
      accessor,
      args = [],
      begin = true
    } = options

    const thisArg = THIS_ARG in options
      ? createThisArgTester(options.thisArg)
      : RETURNS_TRUE

    const expect = createTracesByAccessor(accessor)
    .concat(callTrace(args, thisArg))

    return this._match(expect, begin)
  }

  willBeAccessedBy ({
    accessor,
    begin = true
  }) {
    const expect = createTracesByAccessor(accessor)
    return this._match(expect, begin)
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
