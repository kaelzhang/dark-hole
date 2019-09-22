const {Errors} = require('err-object')

const {TE, E, error} = new Errors()

TE('INVALID_OPTIONS', 'options must be an object')

TE('INVALID_ACCESSOR',
  'accessor should be a string, an array of strings or undefined')

E('NO_MATCH', 'no match found')

module.exports = {
  error
}
