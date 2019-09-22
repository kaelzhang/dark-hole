const {Errors} = require('err-object')

const {E, TE, error} = new Errors()

E('STACK_NOT_FOUND', '')

TE('INVALID_ACCESSOR', 'accessor should be a string of an array of strings')

module.exports = {
  error
}
