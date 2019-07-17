# ![dark-hole](assets/black-hole.jpg)

[![Build Status](https://travis-ci.org/kaelzhang/dark-hole.svg?branch=master)](https://travis-ci.org/kaelzhang/dark-hole)
[![Coverage](https://codecov.io/gh/kaelzhang/dark-hole/branch/master/graph/badge.svg)](https://codecov.io/gh/kaelzhang/dark-hole)

# dark-hole

`dark-hole` swallows(accepts) everything, and everything just disappears(gone). Like a blackhole.

`dark-hole` is useful if you **pretend** to _implement_ some interfaces but not actually implement them.

## Install

```sh
$ npm i dark-hole
```

## Usage

```js
const blackhole = require('dark-hole')()

// It swallows everything
blackhole
.whateverProperty
.asAccessingArrayItem[0]
.runFunction('blah blah')
.destroyTheWorld
.boooooooom
.neverDie()
// Nothing happens. Nothing. Without errors.
```

## License

[MIT](LICENSE)
