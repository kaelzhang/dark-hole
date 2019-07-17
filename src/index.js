// istanbul ignore next
if (typeof Proxy === 'undefined') {
  // istanbul ignore next
  throw new Error('dark-hole requires Proxy')
}

module.exports = () => {
  let proxy

  const origin = () => proxy
  proxy = new Proxy(origin, {
    // Accepts everything
    get () {
      // And always returns itself
      return proxy
    }
  })

  return proxy
}
