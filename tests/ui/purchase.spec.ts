import { test, expect } from '../../src/fixtures/pages';
import { assertCredentials, orderDetails } from '../../src/fixtures/test-data';

test.describe('Purchase flow', () => {
  test('should add a product to the cart and complete a purchase', async ({
    loginPage,
    homePage,
    productPage,
    cartPage,
  }) => {
    const credentials = assertCredentials();

    // Arrange: log in
    await loginPage.open('/');
    await loginPage.login(credentials);

    // Act: add first product to cart
    await homePage.open();
    await homePage.selectFirstProduct();
    const productTitle = await productPage.getProductTitle();

    await productPage.addToCart();

    // Act: go to cart and place order
    await cartPage.open();
    await expect(cartPage.cartItems.first()).toContainText(productTitle);

    await cartPage.placeOrder(orderDetails);
    const confirmation = await cartPage.getConfirmationText();

    // Assert
    expect(confirmation).toContain('Thank you for your purchase');
  });
});
