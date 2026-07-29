import { BasePage } from './base.page';
import type { Page, Locator } from '@playwright/test';

export class HomePage extends BasePage {
  readonly productLinks: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    super(page);
    this.productLinks = page.locator('.card-title a');
    this.productCards = page.locator('.card.h-100');
  }

  async open(): Promise<void> {
    await super.open('/');
    await this.productLinks.first().waitFor({ state: 'visible' });
  }

  async selectProductByName(name: string): Promise<void> {
    await this.productLinks.filter({ hasText: name }).click();
  }

  async selectFirstProduct(): Promise<void> {
    await this.productLinks.first().click();
  }

  async getProductNames(): Promise<string[]> {
    return await this.productLinks.allInnerTexts();
  }
}
