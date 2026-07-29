import { test, expect } from '../../src/fixtures/pages';

test.describe('Catalog browsing', () => {
  test('should filter products by category', async ({ homePage }) => {
    await homePage.open();

    await homePage.selectCategory('Laptops');
    const laptops = await homePage.getProductNames();

    expect(laptops.length).toBeGreaterThan(0);
    // Demoblaze laptop catalog uses these known product names.
    expect(laptops.every((name) => /sony vaio|macbook|dell|asus|hp|apple/i.test(name))).toBe(true);
    expect(laptops.some((name) => /galaxy|iphone|nexus|nokia|htc/i.test(name))).toBe(false);
  });
});
