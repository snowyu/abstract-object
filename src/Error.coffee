util     = require("./util")
inherits = util.inherits

firstLower = (s) ->
  s[0].toLowerCase() + s.substring(1)

module.exports.AbstractError = class AbstractError
  inherits AbstractError, Error

  constructor: (msg, errno) ->
    Error.call this, msg
    @code = errno
    @message = msg
    Error.captureStackTrace this, arguments.callee  if Error.captureStackTrace

module.exports.NotImplementedError = class NotImplementedError
  inherits NotImplementedError, AbstractError

  constructor: ->
    AbstractError.call this, "NotImplemented", kNotSupported

kOk = 0
kNotFound = 1
kCorruption = 2
kNotSupported = 3
kInvalidArgument = 4
kIOError = 5
kNotOpened = 101
kInvalidType = 102
kInvalidFormat = 103

errors =
  Ok: kOk
  NotFound: kNotFound
  Corruption: kCorruption
  NotSupported: kNotSupported
  InvalidArgument: kInvalidArgument
  IO: kIOError
  NotOpened: kNotOpened
  InvalidType: kInvalidType
  InvalidFormat: kInvalidFormat

for k of errors
  # the error code
  AbstractError[k] = errors[k]
  
  #generate AbstractError.isNotFound(err) class methods:
  AbstractError["is" + k] = ((i, aType) ->
    (err) ->
      err.code is i or (not err.code? and err.message and err.message.substring(0, aType.length) is aType)
  )(errors[k], k)
  
  #generate AbstractError.notFound() instance methods:
  AbstractError::[firstLower(k)] = ((aType) ->
    ->
      AbstractError[aType] this
  )("is" + k)
  if errors[k] > 0
    Err = ((i, aType) ->
      (msg) ->
        msg = aType  if not msg? or msg is ""
        AbstractError.call this, msg, i
    )(errors[k], k)
    inherits Err, AbstractError
    
    #generate NotFoundError,... Classes
    module.exports[k + "Error"] = Err

