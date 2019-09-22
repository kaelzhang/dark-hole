const test = require('ava')
// const log = require('util').debuglog('dark-hole')
const {
  create,
  trace
} = require('../src')

const code = 'NO_MATCH'

test('example', t => {
  const blackhole = create()

  const returnValue = blackhole
  .whateverProperty          // 1
  .asAccessingArrayItem[0]   // 2, 3
  .runFunction('blah blah')  // 3, 4
  .destroyTheWorld           // 5
  .boooooooom                // 6
  .neverDie()                // 7, 8

  const tracer = trace(returnValue)

  const after4 = tracer.willBeCalledWith({
    accessor: 'whateverProperty.asAccessingArrayItem.0.runFunction',
    args: ['blah blah'],
    immediately: true
  })

  t.throws(() => tracer.willBeCalledWith({
    accessor: 'asAccessingArrayItem.0.runAFunction',
    args: ['blah blah'],
    immediately: true
  }), {code})

  const end = after4.willBeCalledWith({
    args: []
  })

  t.is(end.ended, true)
  t.is(tracer.willBeCalledWith({
    args: []
  }).ended, true)

  t.throws(() => tracer.willBeCalledWith({
    accessor: 1
  }), {
    code: 'INVALID_ACCESSOR'
  })

  t.throws(() => tracer.willBeAccessedBy(), {
    code: 'INVALID_OPTIONS'
  })
})

test('access', t => {
  const h = create()

  const tracer = trace(h.foo.bar.baz).willBeAccessedBy({
    accessor: ['bar', 'baz']
  })

  t.is(tracer.ended, true)
})

test('exceed length', t => {
  t.throws(() => trace(create().foo.bar.baz).willBeAccessedBy({
    accessor: 'bar.baz.qux'
  }), {
    code
  })
})

test('iterator', t => {
  t.deepEqual([...trace(create().foo.bar)], [{
    type: 'PropertyAccess',
    property: 'foo'
  }, {
    type: 'PropertyAccess',
    property: 'bar'
  }])
})

test('thisArg', t => {
  const thisArg = {
    foo: 1
  }

  const h = create()
  const v = Reflect.apply(h.foo, thisArg, ['foo'])

  trace(v).willBeCalledWith({
    accessor: 'foo',
    thisArg,
    args: ['foo']
  })

  t.pass()
})
