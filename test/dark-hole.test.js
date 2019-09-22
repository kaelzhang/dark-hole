const test = require('ava')
// const log = require('util').debuglog('dark-hole')
const {
  create,
  trace
} = require('../src')

test('example', t => {
  const hole = create()

  const ret = hole
  .whateverProp
  .asAccessingArrayItem[0]
  .runAFunction('blah blah')
  .hahaha
  .boooooooom
  .xxxxx
  .neverDie()

  t.pass()

  const tracer = trace(ret)

  tracer.willBeCalledWith({
    accessor: 'whateverProp.asAccessingArrayItem.0.runAFunction',
    args: ['blah blah']
  })

  t.pass()
})
