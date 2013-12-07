test('parse single commands', function () {
  var subject = 'node test.js hello'.split(' ');
  var args = argv(subject);
  args.commands.should.be.an('array');
  args.commands.should.have.length(1);
  args.commands.should.include('hello');
});

test('parse multiple commands', function () {
  var subject = 'node test.js one two'.split(' ');
  var args = argv(subject);
  args.commands.should.be.an('array');
  args.commands.should.have.length(2);
  args.commands.should.include('one', 'two');
});

test('user the #command helper', function () {
  var subject = 'node test.js o two'.split(' ');
  var args = argv(subject);

  args.commands.should.be.an('array');
  args.commands.should.have.length(2);
  args.commands.should.include('o', 'two');

  args.should.respondTo('command');
  args.command('one', 'o').should.be.true;
  args.command('two', 't').should.be.true;
  args.command('four', 'f').should.be.false;
});
