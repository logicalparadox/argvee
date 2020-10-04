import { match, parse, select, selectNumber, selectString } from '../lib';

describe('#parse', () => {
  describe('commands', () => {
    it('should parse single commands', () => {
      const subject = 'node test.js hello'.split(' ');
      const args = parse(subject);
      args.commands.should.be.an('array');
      args.commands.should.have.length(1);
      args.commands.should.include('hello');
    });

    it('should parse multiple commands', () => {
      const subject = 'node test.js one two'.split(' ');
      const args = parse(subject);
      args.commands.should.be.an('array');
      args.commands.should.have.length(2);
      args.commands.should.include('one', 'two');
    });
  });

  describe('modes', () => {
    it('should parse long form modes', () => {
      const subject = 'node test.js --subject --noun'.split(' ');
      const args = parse(subject);
      args.modes.should.be.an('array');
      args.modes.should.have.length(2);
      args.modes.should.include('subject', 'noun');
    });

    it('should parse short form seperate modes', () => {
      const subject = 'node test.js -sn'.split(' ');
      const args = parse(subject);
      args.modes.should.be.an('array');
      args.modes.should.have.length(2);
      args.modes.should.include('s', 'n');
    });

    it('should parse short form combined modes', () => {
      const subject = 'node test.js -s -n'.split(' ');
      const args = parse(subject);
      args.modes.should.be.an('array');
      args.modes.should.have.length(2);
      args.modes.should.include('s', 'n');
    });
  });

  describe('params', () => {
    it('should parse long form space-delimeted params', () => {
      const subject = 'node test.js --hello universe'.split(' ');
      const args = parse(subject);

      args.params.should.be
        .an('object')
        .and.have.keys('hello')
        .and.have.property('hello')
        .an('array')
        .and.deep.equal(['universe']);
    });

    it('should parse long form `=` params', () => {
      const subject = 'node test.js --hello=universe'.split(' ');
      const args = parse(subject);

      args.params.should.be
        .an('object')
        .and.have.keys('hello')
        .and.have.property('hello')
        .an('array')
        .and.deep.equal(['universe']);
    });

    it('should parse short form spaced params', () => {
      const subject = 'node test.js -h universe'.split(' ');
      const args = parse(subject);

      args.params.should.be
        .an('object')
        .and.have.keys('h')
        .and.have.property('h')
        .an('array')
        .and.deep.equal(['universe']);
    });

    it('should parse short form `=` params', () => {
      const subject = 'node test.js -h=universe'.split(' ');
      const args = parse(subject);

      args.params.should.be
        .an('object')
        .and.have.keys('h')
        .and.have.property('h')
        .an('array')
        .and.deep.equal(['universe']);
    });

    it('should parse multiple params of the same key', () => {
      const subject = 'node test.js -h hello -h universe'.split(' ');
      const args = parse(subject);

      args.params.should.be
        .an('object')
        .and.have.keys('h')
        .and.have.property('h')
        .an('array')
        .with.lengthOf(2)
        .and.deep.equal(['hello', 'universe']);
    });

    it('should parse a multiword string', () => {
      const subject = 'node test.js --subject "hello my universe" -h "are you"'.split(
        ' ',
      );

      const args = parse(subject);

      args.params.should.be.an('object').and.deep.equal({
        subject: ['hello my universe'],
        h: ['are you'],
      });
    });
  });
});

describe('#match', () => {
  it('should match', () => {
    const subject = 'node test.js one -h --world'.split(' ');
    const args = parse(subject);

    match(args.commands, 'one', 'three').should.be.true;
    match(args.commands, 'two', 'three').should.be.false;

    match(args.modes, 'h', 'hello').should.be.true;
    match(args.modes, 'w', 'world').should.be.true;
  });
});

describe('#select', () => {
  it('should select', () => {
    const subject = 'node test.js -p 8080 --host localhost'.split(' ');
    const args = parse(subject);

    select(args.params, 'h', 'host', 'p', 'port').should.deep.eq([
      'localhost',
      8080,
    ]);
  });
});

describe('#selectString', () => {
  it('should select', () => {
    const subject = 'node test.js -h hello --hello hello2 --world universe'.split(
      ' ',
    );
    const args = parse(subject);

    selectString(args.params, 'h', 'hello').should.deep.eq(['hello', 'hello2']);
    selectString(args.params, 'w', 'world').should.deep.eq(['universe']);
  });
});

describe('#selectNumber', () => {
  it('should select', () => {
    const subject = 'node test.js one -p 8080 --float 3.14'.split(' ');
    const args = parse(subject);

    selectNumber(args.params, 'p', 'port').should.deep.eq([8080]);
    selectNumber(args.params, 'f', 'float').should.deep.eq([3.14]);
  });
});
