import { BasePage } from './base.page';
import type { Page, Locator } from '@playwright/test';
import type { OrderDetails } from '../types';

export class CartPage extends BasePage {
  readonly placeOrderButton: Locator;
  readonly orderModal: Locator;
  readonly nameInput: Locator;
  readonly countryInput: Locator;
  readonly cityInput: Locator;
  readonly cardInput: Locator;
  readonly monthInput: Locator;
  readonly yearInput: Locator;
  readonly purchaseButton: Locator;
  readonly confirmationMessage: Locator;
  readonly cartItems: Locator;

  constructor(page: Page) {
    super(page);
    this.placeOrderButton = page.locator('button:has-text("Place Order")');
    this.orderModal = page.locator('#orderModal');
    this.nameInput = page.locator('#name');
    this.countryInput = page.locator('#country');
    this.cityInput = page.locator('#city');
    this.cardInput = page.locator('#card');
    this.monthInput = page.locator('#month');
    this.yearInput = page.locator('#year');
    this.purchaseButton = page.locator('#orderModal button.btn-primary');
    this.confirmationMessage = page.locator('.sweet-alert h2');
    this.cartItems = page.locator('#tbodyid tr');
  }

  async open(): Promise<void> {
    await super.open('/cart.html');
    await this.placeOrderButton.waitFor({ state: 'visible' });
  }

  async placeOrder(details: OrderDetails): Promise<void> {
    await this.placeOrderButton.click();
    await this.orderModal.waitFor({ state: 'visible' });
    await this.nameInput.fill(details.name);
    await this.countryInput.fill(details.country);
    await this.cityInput.fill(details.city);
    await this.cardInput.fill(details.card);
    await this.monthInput.fill(details.month);
    await this.yearInput.fill(details.year);
    await this.purchaseButton.click();
  }

  async getConfirmationText(): Promise<string> {
    await this.confirmationMessage.waitFor({ state: 'visible' });
    return (await this.confirmationMessage.textContent()) || '';
  }

  async getCartItemCount(): Promise<number> {
    return await this.cartItems.count();
  }

  async removeFirstItem(): Promise<void> {
    const deleteLink = this.cartItems.first().locator('a', { hasText: 'Delete' });
    await deleteLink.click();
  }

  async waitForEmptyCart(): Promise<void> {
    await this.page.waitForFunction(() => {
      return document.querySelectorAll('#tbodyid tr').length === 0;
    });
  }
}
