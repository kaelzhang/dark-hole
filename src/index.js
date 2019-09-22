const {
  STACK,
  ACCESS,
  CALL,

  trace,
  Tracer
} = require('./trace')

const createProxy = tracer => {
  const origin = function (...args) {
    return createProxy(tracer[CALL](args, this))
  }

  return new Proxy(origin, {
    // Accepts everything
    // And always returns itself
    get (target, prop) {
      if (prop === STACK) {
        return tracer
      }

      return createProxy(tracer[ACCESS](prop))
    }
  })
}

const create = () => createProxy(new Tracer([]))

module.exports = {
  create,
  trace
}
