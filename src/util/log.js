var inspect = require('util').inspect;

module.exports = function(msg, type, depth) {
  if (isNaN(depth)) depth = 10;
  if (!type) type = 'log';
  console[type](inspect(msg, {depth: depth}));
}
