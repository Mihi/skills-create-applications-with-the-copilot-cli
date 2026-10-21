const assert = require('node:assert/strict');
const { spawnSync } = require('node:child_process');
const path = require('node:path');
const { describe, it } = require('node:test');

const calculatorPath = path.join(__dirname, '..', 'calculator.js');
const { calculate, modulo, power, squareRoot } = require('../calculator.js');

describe('calculate', () => {
  describe('addition', () => {
    it('adds the example values', () => {
      assert.equal(calculate(2, '+', 3), 5);
    });

    it('supports negative and decimal operands', () => {
      assert.equal(calculate(-2.5, '+', 1.25), -1.25);
    });

    it('adds zero without changing the other operand', () => {
      assert.equal(calculate(0, '+', 7), 7);
    });
  });

  describe('subtraction', () => {
    it('subtracts the example values', () => {
      assert.equal(calculate(10, '-', 4), 6);
    });

    it('supports negative and decimal operands', () => {
      assert.equal(calculate(-2.5, '-', 1.25), -3.75);
    });

    it('subtracts an operand from itself', () => {
      assert.equal(calculate(7, '-', 7), 0);
    });
  });

  describe('multiplication', () => {
    it('multiplies the example values', () => {
      assert.equal(calculate(45, '*', 2), 90);
    });

    it('supports negative and decimal operands', () => {
      assert.equal(calculate(-2.5, '*', 1.2), -3);
    });

    it('multiplies by zero', () => {
      assert.equal(calculate(7, '*', 0), 0);
    });
  });

  describe('division', () => {
    it('divides the example values', () => {
      assert.equal(calculate(20, '/', 5), 4);
    });

    it('supports negative and decimal operands', () => {
      assert.equal(calculate(-7.5, '/', 2.5), -3);
    });

    it('returns a fractional result when the division is not even', () => {
      assert.equal(calculate(7, '/', 2), 3.5);
    });

    it('throws a clear error when dividing by zero', () => {
      assert.throws(
        () => calculate(7, '/', 0),
        { name: 'RangeError', message: 'Cannot divide by zero.' },
      );
    });
  });

  it('rejects operands that are not finite numbers', () => {
    for (const operand of [Number.NaN, Infinity, -Infinity, '2']) {
      assert.throws(
        () => calculate(operand, '+', 1),
        { name: 'TypeError', message: 'Both operands must be valid finite numbers.' },
      );
      assert.throws(
        () => calculate(1, '+', operand),
        { name: 'TypeError', message: 'Both operands must be valid finite numbers.' },
      );
    }
  });

  it('rejects unsupported operations', () => {
    assert.throws(
      () => calculate(1, 'unknown', 2),
      { name: 'TypeError', message: 'Unsupported operation: unknown' },
    );
  });
});

describe('modulo', () => {
  it('returns the image example remainder', () => {
    assert.equal(modulo(5, 2), 1);
  });

  it('returns the remainder of a division', () => {
    assert.equal(modulo(10, 3), 1);
  });

  it('supports negative operands', () => {
    assert.equal(modulo(-10, 3), -1);
  });

  it('throws a clear error when the divisor is zero', () => {
    assert.throws(
      () => modulo(10, 0),
      { name: 'RangeError', message: 'Cannot calculate modulo with a divisor of zero.' },
    );
  });

  it('rejects non-finite operands', () => {
    assert.throws(
      () => modulo(Infinity, 3),
      { name: 'TypeError', message: 'Both operands must be valid finite numbers.' },
    );
  });
});

describe('power', () => {
  it('raises the image example base to its exponent', () => {
    assert.equal(power(2, 3), 8);
  });

  it('raises a base to an exponent', () => {
    assert.equal(power(2, 3), 8);
  });

  it('supports zero and negative exponents', () => {
    assert.equal(power(5, 0), 1);
    assert.equal(power(2, -2), 0.25);
  });

  it('rejects non-finite operands', () => {
    assert.throws(
      () => power(2, Number.NaN),
      { name: 'TypeError', message: 'Both operands must be valid finite numbers.' },
    );
  });
});

describe('squareRoot', () => {
  it('returns the image example square root', () => {
    assert.equal(squareRoot(16), 4);
  });

  it('returns the square root of a number', () => {
    assert.equal(squareRoot(81), 9);
  });

  it('returns zero for zero', () => {
    assert.equal(squareRoot(0), 0);
  });

  it('throws a clear error for negative numbers', () => {
    assert.throws(
      () => squareRoot(-1),
      { name: 'RangeError', message: 'Cannot calculate the square root of a negative number.' },
    );
  });

  it('rejects non-finite input', () => {
    assert.throws(
      () => squareRoot(Infinity),
      { name: 'TypeError', message: 'Input must be a valid finite number.' },
    );
  });
});

describe('calculator CLI', () => {
  it('supports modulo and exponentiation', () => {
    for (const [args, expected] of [
      [['5', '%', '2'], '1'],
      [['2', '**', '3'], '8'],
    ]) {
      const result = spawnSync(process.execPath, [calculatorPath, ...args], { encoding: 'utf8' });
      assert.equal(result.status, 0);
      assert.equal(result.stdout.trim(), expected);
    }
  });

  it('supports square root', () => {
    const result = spawnSync(process.execPath, [calculatorPath, 'sqrt', '16'], { encoding: 'utf8' });
    assert.equal(result.status, 0);
    assert.equal(result.stdout.trim(), '4');
  });

  it('reports square root of a negative number as an error', () => {
    const result = spawnSync(process.execPath, [calculatorPath, 'sqrt', '-1'], { encoding: 'utf8' });
    assert.equal(result.status, 1);
    assert.match(result.stderr, /Cannot calculate the square root of a negative number\./);
  });
});
