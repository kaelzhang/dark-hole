module.exports = () => {
  let proxy
  const origin = () => proxy
  return proxy = new Proxy(origin, {
    // Accepts everything
    // And always returns itself
    get: origin
  })
}
