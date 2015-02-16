try
  RefObject = require('ref-object')
catch e
  console.error('this has been moved to `ref-object` package, pls install `ref-object`:')
  console.error('`npm install ref-object`')
  throw e


module.exports = RefObject
