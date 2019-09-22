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
})
