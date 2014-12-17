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


