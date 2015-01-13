module.exports = function(aFunc) {
  var result = /^function\s*\S*\s*\(.*\)\s*{[\s;]*}$/.test(aFunc.toString());
  return result;
}
