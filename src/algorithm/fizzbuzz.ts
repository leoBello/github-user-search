/**
 * FizzBuzz algorithm: generates sequence from 1 to N inclusive.
 * @param n - Positive integer upper limit (>= 1)
 * @returns Array of strings representing FizzBuzz sequence
 * @throws Error if n < 1
 */
export function fizzbuzz(n: number): string[] {
  if (n < 1 || !Number.isInteger(n)) {
    throw new Error('n must be a positive integer >= 1');
  }

  const result: string[] = [];

  for (let i = 1; i <= n; i++) {
    let output = '';

    if (i % 3 === 0) {
      output += 'Fizz';
    }
    if (i % 5 === 0) {
      output += 'Buzz';
    }
    if (output === '') {
      output = i.toString();
    }

    result.push(output);
  }

  return result;
}
