import { aaadd } from './sum'

describe('function sum', () => {
  test('It returns the correct number', () => {
    expect(aaadd(1, 1)).toBe(2);
    expect(aaadd(1, 10)).toBe(11);
    expect(aaadd(3, 9)).toBe(12);
  });
});