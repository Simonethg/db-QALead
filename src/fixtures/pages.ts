import { test as base } from '@playwright/test';
import { HomePage } from '../pages/home.page';
import { LoginPage } from '../pages/login.page';
import { ProductPage } from '../pages/product.page';
import { CartPage } from '../pages/cart.page';
import { RestfulBookerClient } from '../helpers/api-client';
import { getEnvironmentConfig } from '../config/environments';

type Pages = {
  homePage: HomePage;
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
  apiClient: RestfulBookerClient;
};

export const test = base.extend<Pages>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  apiClient: async ({ request }, use) => {
    const config = getEnvironmentConfig();
    await use(new RestfulBookerClient(request, config.apiBaseURL));
  },
});

export { expect } from '@playwright/test';
