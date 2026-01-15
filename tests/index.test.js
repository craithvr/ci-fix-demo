import { add, multiply, factorial, getValueOrDefault, getNestedProperty } from '../src/index.js';

describe('Math functions', () => {
  test('add returns correct sum', () => {
    expect(add(2, 3)).toBe(5);
    expect(add(-1, 1)).toBe(0);
  });

  test('multiply returns correct product', () => {
    expect(multiply(3, 4)).toBe(12);
    expect(multiply(0, 100)).toBe(0);
  });

  test('factorial calculates correctly', () => {
    expect(factorial(0)).toBe(1);
    expect(factorial(1)).toBe(1);
    expect(factorial(5)).toBe(120);
  });

  test('factorial throws for negative numbers', () => {
    expect(() => factorial(-1)).toThrow('Factorial not defined for negative numbers');
  });
});

describe('Modern JS features', () => {
  test('nullish coalescing works correctly', () => {
    expect(getValueOrDefault(null, 'default')).toBe('default');
    expect(getValueOrDefault(undefined, 'default')).toBe('default');
    expect(getValueOrDefault(0, 'default')).toBe(0);
    expect(getValueOrDefault('', 'default')).toBe('');
  });

  test('optional chaining works correctly', () => {
    const obj = { nested: { foo: 'bar' } };
    expect(getNestedProperty(obj, 'foo')).toBe('bar');
    expect(getNestedProperty(null, 'foo')).toBeUndefined();
    expect(getNestedProperty({}, 'foo')).toBeUndefined();
  });
});
