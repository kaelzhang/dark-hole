const test = require('ava')
// const log = require('util').debuglog('dark-hole')
const {create} = require('../src')

test('example', t => {
  const hole = create()

  hole
  .whateverProp
  .asAccessingArrayItem[0]
  .runAFunction('blah blah')
  .hahaha
  .boooooooom
  .xxxxx
  .neverDie()

  t.pass()
})
