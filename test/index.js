/*!
 * Module dependencies.
 */

var chai = require('chai');
var argvee = require('..');

/*!
 * Tests.
 */

var tests = [];
var failures = [];

/*!
 * Push a new test to run.
 *
 * @param {String} title
 * @param {Function} body
 * @api public
 */

global.test = function(title, fn) {
  tests.push({ title: title, fn: fn});
};

/*!
 * Make `should` global.
 */

global.should = chai.should();

/*!
 * Make `argvee` global.
 */

global.argv = argvee;

/*!
 * Require the tests.
 */

require('./commands');
require('./modes');
require('./params');

/*!
 * Run the tests.
 */

tests.forEach(function(test) {
  try {
    test.fn();
  } catch (err) {
    failures.push({ title: test.title, error: err });
  }
});

/*!
 * Tests overview.
 */

console.log('%d tests, %d failures', tests.length, failures.length);

/*!
 * Print stacks if any.
 */

failures.forEach(function(fail, i) {
  console.log('%d) Test: %s', i, fail.title);
  console.log('    '  + fail.error.stack);
  console.log();
});

/*!
 * Exit with the number of failed tests.
 */

process.exit(failures.length);
