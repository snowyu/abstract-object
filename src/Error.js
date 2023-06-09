try {
  module.exports = require('abstract-error');
} catch (error) {
  console.error("the AbstractError has moved to `abstract-error` package\nnpm install abstract-error first");
  throw error;
}
