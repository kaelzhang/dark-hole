# ![dark-hole](assets/black-hole.jpg)

[![Build Status](https://travis-ci.org/kaelzhang/dark-hole.svg?branch=master)](https://travis-ci.org/kaelzhang/dark-hole)
[![Coverage](https://codecov.io/gh/kaelzhang/dark-hole/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/dark-hole)

# dark-hole

`dark-hole` swallows(accepts) everything, and everything just disappears(gone). Like a blackhole.

`dark-hole` is useful if you **pretend** to _implement_ some interfaces but not actually implement them.

And you could trace everything that swallowed by `dark-hole`, which is very useful for testing purpose

## Install

```sh
$ npm i dark-hole
```

## Usage

```js
const {
  create,
  trace
} = require('dark-hole')

// Create a blackhole which swallows everything
const blackhole = create()

const returnValue = blackhole
.whateverProperty          // 1
.asAccessingArrayItem[0]   // 2, 3
.runFunction('blah blah')  // 3, 4
.destroyTheWorld           // 5
.boooooooom                // 6
.neverDie()                // 7, 8
// Nothing happens. Nothing. Without errors.
```

### Trace accessing and invoking

```js
// Create a tracer which could trace back upon time
// to the very beginning of the `blackhole`
// just like a time machine
const tracer = trace(returnValue)

// `willBeCalledWith()` returns a new tracker afterwards
// if there is a match
const after4 = tracer.willBeCalledWith({
  // accessing the property from any time spot is ok
  accessor: 'asAccessingArrayItem.0.runFunction',
  args: ['blah blah']
})

try {
  tracer.willBeCalledWith({
    accessor: 'asAccessingArrayItem.0.runFunction',
    args: ['blah blah'],
    // The accessing must happens immediately
    immediately: true
  })
} catch (err) {
  console.log(err.code)
  // 'NO_MATCH'
}
```

### Only trace accessing

```js
const after7 = after4.willBeAccessedBy({
  accessor: 'destroyTheWorld.boooooooom.neverDie',
  immediately: true
})

// No errors
```

### Only trace function call

```js
const end = after7.willBeCalledWith({
  args: [],
  immediately: true
})

console.log(end.ended)
// true
// , if nothing happens afterwards
```

## License

[MIT](LICENSE)
