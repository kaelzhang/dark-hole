// istanbul ignore next
if (typeof Proxy === 'undefined') {
  // istanbul ignore next
  throw new Error('dark-hole requires Proxy')
}

module.exports = () => {
  let proxy

  const origin = () => proxy
  proxy = new Proxy(origin, {
    get () {
      return proxy
    }
  })

  return proxy
}
