test('parse long form `=` params', function () {
  var subject = 'node test.js --hello=universe'.split(' ');
  var args = argv(subject);

  args.params.should
  .be.an('object')
  .and.have.keys('hello')
  .and.have.property('hello')
    .an('array')
    .and.deep.equal([ 'universe' ]);
});

test('parse long form spaced params', function () {
  var subject = 'node test.js --hello universe'.split(' ')
  var args = argv(subject);

  args.params.should
  .be.an('object')
  .and.have.keys('hello')
  .and.have.property('hello')
    .an('array')
    .and.deep.equal([ 'universe' ]);
});

test('parse short form `=` params', function () {
  var subject = 'node test.js -h=universe'.split(' ');
  var args = argv(subject);

  args.params.should
  .be.an('object')
  .and.have.keys('h')
  .and.have.property('h')
    .an('array')
    .and.deep.equal([ 'universe' ]);
});

test('parse short form spaced params', function () {
  var subject = 'node test.js -h universe'.split(' ');
  var args = argv(subject);

  args.params.should
  .be.an('object')
  .and.have.keys('h')
  .and.have.property('h')
    .an('array')
    .and.deep.equal([ 'universe' ]);
});

test('parse multiple params of same key', function () {
  var subject = 'node test.js -h hello -h universe'.split(' ');
  var args = argv(subject);

  args.params.should
  .be.an('object')
  .and.have.keys('h')
  .and.have.property('h')
    .an('array')
    .with.lengthOf(2)
    .and.deep.equal([ 'hello', 'universe' ]);
});

test('use the #param helper', function () {
  var subject = 'node test.js --subject hello -n universe --verb=say -a=hi'.split(' ');
  var args = argv(subject);

  args.params.should
  .be.an('object')
  .and.have.keys('subject', 'n', 'verb', 'a');

  args.should
  .respondTo('param');

  args.param('subject', 's').should
  .be.an('array')
  .and.deep.equal([ 'hello' ]);

  args.param('noun', 'n').should
  .be.an('array')
  .and.deep.equal([ 'universe' ]);

  args.param('verb', 'v').should
  .be.an('array')
  .and.deep.equal([ 'say' ]);

  args.param('action', 'a').should
  .be.an('array')
  .and.deep.equal([ 'hi' ]);

  should.not.exist(args.param('bye', 'b'));
});

test('parse a multiword string', function () {
  var subject = 'node test.js --subject "hello universe" -h "are you"'.split(' ');
  var args = argv(subject);

  args.params.should
  .be.an('object')
  .and.have.keys('subject', 'h');

  args.should
  .respondTo('param');

  args.param('subject').should
  .be.an('array')
  .and.deep.equal([ 'hello universe' ]);

  args.param('h').should
  .be.an('array')
  .and.deep.equal([ 'are you' ]);
});
