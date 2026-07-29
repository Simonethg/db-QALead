import { BasePage } from './base.page';
import type { Page, Locator } from '@playwright/test';

export class ProductPage extends BasePage {
  readonly addToCartButton: Locator;
  readonly productTitle: Locator;
  readonly productPrice: Locator;

  constructor(page: Page) {
    super(page);
    this.addToCartButton = page.locator('a.btn:has-text("Add to cart")');
    this.productTitle = page.locator('.name');
    this.productPrice = page.locator('.price-container');
  }

  async addToCart(): Promise<void> {
    const dialogPromise = this.page.waitForEvent('dialog');
    await this.addToCartButton.click();
    const dialog = await dialogPromise;
    await dialog.accept();
  }

  async getProductTitle(): Promise<string> {
    return (await this.productTitle.textContent()) || '';
  }
}
