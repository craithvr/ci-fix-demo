/**
 * Simple utility functions for the CI demo
 */

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

export function factorial(n) {
  if (n < 0) throw new Error('Factorial not defined for negative numbers');
  if (n === 0 || n === 1) return 1;
  return n * factorial(n - 1);
}

export async function fetchData(url) {
  // Uses modern fetch API (Node 18+)
  const response = await fetch(url);
  return response.json();
}

// Using nullish coalescing (ES2020)
export function getValueOrDefault(value, defaultValue) {
  return value ?? defaultValue;
}

// Using optional chaining (ES2020)
export function getNestedProperty(obj, prop) {
  return obj?.nested?.[prop];
}
