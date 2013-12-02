test('parse long form modes', function() {
  var subject = 'node test.js --subject --noun'.split(' ');
  var args = argv(subject);
  args.modes.should.be.an('array');
  args.modes.should.have.length(2);
  args.modes.should.include('subject', 'noun');
});

test('parse short form combined modes', function() {
  var subject = 'node test.js -sn'.split(' ');
  var args = argv(subject);
  args.modes.should.be.an('array');
  args.modes.should.have.length(2);
  args.modes.should.include('s', 'n');
});

test('parse short form seperate modes', function() {
  var subject = 'node test.js -s -n'.split(' ');
  var args = argv(subject);
  args.modes.should.be.an('array');
  args.modes.should.have.length(2);
  args.modes.should.include('s', 'n');
});

test('use the #mode helper', function() {
  var subject = 'node test.js --subject -n'.split(' ');
  var args = argv(subject);

  args.modes.should.be.an('array');
  args.modes.should.have.length(2);
  args.modes.should.include('subject', 'n');

  args.should.respondTo('mode');
  args.mode('subject', 's').should.be.true;
  args.mode('noun', 'n').should.be.true;
  args.mode('verb', 'v').should.be.false;
});
