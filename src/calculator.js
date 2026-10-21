#!/usr/bin/env node

// Supports addition (+), subtraction (-), multiplication (*), division (/),
// modulo (%), exponentiation (**), and square root (sqrt).
function calculate(left, operator, right) {
  if (!Number.isFinite(left) || !Number.isFinite(right)) {
    throw new TypeError('Both operands must be valid finite numbers.');
  }

  switch (operator) {
    case '+':
      return left + right;
    case '-':
      return left - right;
    case '*':
      return left * right;
    case '/':
      if (right === 0) {
        throw new RangeError('Cannot divide by zero.');
      }
      return left / right;
    case '%':
      return modulo(left, right);
    case '**':
      return power(left, right);
    default:
      throw new TypeError(`Unsupported operation: ${operator}`);
  }
}

function modulo(a, b) {
  if (!Number.isFinite(a) || !Number.isFinite(b)) {
    throw new TypeError('Both operands must be valid finite numbers.');
  }
  if (b === 0) {
    throw new RangeError('Cannot calculate modulo with a divisor of zero.');
  }
  return a % b;
}

function power(base, exponent) {
  if (!Number.isFinite(base) || !Number.isFinite(exponent)) {
    throw new TypeError('Both operands must be valid finite numbers.');
  }
  return base ** exponent;
}

function squareRoot(n) {
  if (!Number.isFinite(n)) {
    throw new TypeError('Input must be a valid finite number.');
  }
  if (n < 0) {
    throw new RangeError('Cannot calculate the square root of a negative number.');
  }
  return Math.sqrt(n);
}

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args[0] === 'sqrt') {
    if (args.length !== 2 || args[1].trim() === '') {
      console.error('Usage: node src/calculator.js sqrt <number>');
      process.exitCode = 1;
    } else {
      try {
        console.log(squareRoot(Number(args[1])));
      } catch (error) {
        console.error(error.message);
        process.exitCode = 1;
      }
    }
  } else if (args.length !== 3) {
    console.error('Usage: node src/calculator.js <number> <+|-|*|/|%|**> <number>');
    process.exitCode = 1;
  } else {
    const [leftText, operator, rightText] = args;
    const left = Number(leftText);
    const right = Number(rightText);

    try {
      if (leftText.trim() === '' || rightText.trim() === '') {
        throw new TypeError('Both operands must be valid finite numbers.');
      }
      console.log(calculate(left, operator, right));
    } catch (error) {
      console.error(error.message);
      process.exitCode = 1;
    }
  }
}

module.exports = { calculate, modulo, power, squareRoot };
