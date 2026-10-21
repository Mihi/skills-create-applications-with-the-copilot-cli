#!/usr/bin/env node

// Supports addition (+), subtraction (-), multiplication (*), and division (/).
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
    default:
      throw new TypeError(`Unsupported operation: ${operator}`);
  }
}

if (require.main === module) {
  const args = process.argv.slice(2);

  if (args.length !== 3) {
    console.error('Usage: node src/calculator.js <number> <+|-|*|/> <number>');
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

module.exports = { calculate };
