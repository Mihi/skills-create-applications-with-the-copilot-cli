const assert = require('node:assert/strict');
const { describe, it } = require('node:test');

const { calculate } = require('../calculator.js');

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
      () => calculate(1, '%', 2),
      { name: 'TypeError', message: 'Unsupported operation: %' },
    );
  });
});
