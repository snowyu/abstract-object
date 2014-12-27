chai            = require 'chai'
assert          = chai.assert
should          = chai.should()

util            = require "../lib/util"
Errors          = require("../lib/Error")
AbstractError   = Errors.AbstractError

describe "test AbstractErrors", ->
  it "test AbstractError constants", ->
    assert.equal AbstractError.Ok, 0
    assert.equal AbstractError.NotFound, 1

  it "test AbstractError Class Methods",  ->
    err = new AbstractError("", 1)
    assert.ok AbstractError.isNotFound(err), "should be notFound"
    assert.notOk AbstractError.isOk(err), "should not be ok"
    err.code = 0
    assert.ok AbstractError.isOk(err), "should be ok"

  it "test AbstractError Classes",  ->
    err = new Errors.NotFoundError()
    assert.equal err.name, "NotFoundError"
    assert.ok AbstractError.isNotFound(err), "should be notFound"
    assert.ok err.notFound(), "should be notFound"
    assert.notOk AbstractError.isOk(err), "should not be ok"
    err.code = 0
    assert.ok AbstractError.isOk(err), "should be ok"
    assert.notOk err.notFound(), "should not be notFound"
    err.code = null
    assert.ok err.notFound(), "should be notFound"

  it "test AbstractError instance",  ->
    err = new Errors.InvalidArgumentError("")
    assert.notOk err.ok(), "should not be ok"
    assert.notOk err.notFound(), "should not be notFound"
    assert.ok err.invalidArgument(), "should be invalidArgument"
    assert.equal err.message, "InvalidArgument"
    err = new Errors.InvalidArgumentError()
    assert.equal err.message, "InvalidArgument"

describe "test extend AbstractError", ->
  createError = Errors.createError
  it "should add a new Error class to AbstractError", ->
    ErrCls = createError("MyError", 1000)
    err = new ErrCls("already read over error.")
    assert.ok AbstractError.isMyError(err)
    assert.ok err.myError()
    assert.equal err.message, "already read over error."
    assert.equal err.code, 1000

  it "should add a new Error class to MyError", ->
    MyError = createError("MyError", 1000)
    Error1 = createError("Error1", 12, MyError)
    err = new Error1("already read over error.")
    assert.instanceOf err, MyError
    assert.equal err.name, "Error1Error"
    assert.equal err.message, "already read over error."
    assert.equal err.code, 12
    assert.ok MyError.isError1(err), "MyError.isError1"
    assert.ok err.error1(), "err.error1"

