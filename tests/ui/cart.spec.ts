import { test, expect } from '../../src/fixtures/pages';

test.describe('Cart', () => {
  test('should add a product to the cart and remove it', async ({
    homePage,
    productPage,
    cartPage,
  }) => {
    await homePage.open();
    await homePage.selectFirstProduct();
    const productTitle = await productPage.getProductTitle();

    // addToCart waits for and accepts Demoblaze's confirmation dialog.
    await productPage.addToCart();

    await cartPage.open();
    await expect(cartPage.cartItems.first()).toContainText(productTitle, { timeout: 15_000 });
    expect(await cartPage.getCartItemCount()).toBeGreaterThan(0);

    await cartPage.removeFirstItem();
    await cartPage.waitForEmptyCart();
    expect(await cartPage.getCartItemCount()).toBe(0);
  });
});
