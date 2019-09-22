const {
  STACK,
  ACCESS,
  CALL,

  trace,
  Tracer
} = require('./trace')

const NOOP = () => {}

const createProxy = tracer => new Proxy(NOOP, {
  apply (_, thisArg, args) {
    return createProxy(tracer[CALL](args, thisArg))
  },

  // Accepts everything
  // And always returns itself
  get (_, prop) {
    if (prop === STACK) {
      return tracer
    }

    return createProxy(tracer[ACCESS](prop))
  }
})

const create = () => createProxy(new Tracer([]))

module.exports = {
  create,
  trace
}
