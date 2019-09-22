const {Errors} = require('err-object')

const {E, TE, error} = new Errors()

E('STACK_NOT_FOUND', '')

E('NO_MATCH', 'xx')

TE('INVALID_ACCESSOR',
  'accessor should be a string, an array of strings or undefined')

module.exports = {
  error
}
