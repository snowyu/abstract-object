try
  module.exports = require('abstract-error')
catch e
  console.error """the AbstractError has moved to `abstract-error` package
  npm install abstract-error first
  """
  throw e

