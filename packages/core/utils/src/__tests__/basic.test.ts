/**
 * Basic test to verify Jest configuration
 */

describe('Utils Package', () => {
  it('should run tests successfully', () => {
    expect(true).toBe(true);
  });

  it('should support TypeScript', () => {
    const number: number = 42;
    expect(typeof number).toBe('number');
  });

  it('should have access to jest globals', () => {
    expect(jest).toBeDefined();
    expect(describe).toBeDefined();
    expect(it).toBeDefined();
    expect(expect).toBeDefined();
  });
});