// fizzbuzz.test.ts
import { fizzbuzz } from './fizzbuzz';

describe('FizzBuzz', () => {
  test('N=1 returns ["1"]', () => {
    expect(fizzbuzz(1)).toEqual(['1']);
  });

  test('N=3 returns ["1","2","Fizz"]', () => {
    expect(fizzbuzz(3)).toEqual(['1', '2', 'Fizz']);
  });

  test('N=5 returns ["1","2","Fizz","4","Buzz"]', () => {
    expect(fizzbuzz(5)).toEqual(['1', '2', 'Fizz', '4', 'Buzz']);
  });

  test('N=15 includes FizzBuzz', () => {
    expect(fizzbuzz(15)).toContain('FizzBuzz');
  });

  test('full sequence up to 15 is correct', () => {
    expect(fizzbuzz(15)).toEqual([
      '1',
      '2',
      'Fizz',
      '4',
      'Buzz',
      'Fizz',
      '7',
      '8',
      'Fizz',
      'Buzz',
      '11',
      'Fizz',
      '13',
      '14',
      'FizzBuzz',
    ]);
  });

  test('large N=100 works without performance issue', () => {
    const result = fizzbuzz(100);
    expect(result).toHaveLength(100);
    expect(result[98]).toBe('Fizz'); // 99 % 3 === 0
    expect(result[99]).toBe('Buzz'); // 100 % 5 === 0
  });

  test('throws for n=0 (zero case)', () => {
    expect(() => fizzbuzz(0)).toThrow('n must be a positive integer >= 1');
  });

  test('throws for n negative integer', () => {
    expect(() => fizzbuzz(-1)).toThrow('n must be a positive integer >= 1');
  });

  test('throws for n decimal', () => {
    expect(() => fizzbuzz(3.5)).toThrow('n must be a positive integer >= 1');
  });

  test('throws for n non-number', () => {
    expect(() => fizzbuzz('abc' as any)).toThrow(
      'n must be a positive integer >= 1',
    );
  });

  test('multiples of 3 only: 6,9,12', () => {
    expect(fizzbuzz(12).filter((x) => x === 'Fizz').length).toBe(4); // 3,6,9,12
  });

  test('multiples of 5 only: 5,10', () => {
    expect(fizzbuzz(12).filter((x) => x === 'Buzz').length).toBe(2); // 5,10
  });

  test('FizzBuzz at 15,30,...', () => {
    expect(fizzbuzz(30).filter((x) => x === 'FizzBuzz')).toHaveLength(2); // 15,30
  });
});
