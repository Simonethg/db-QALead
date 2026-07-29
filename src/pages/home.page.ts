import { BasePage } from './base.page';
import type { Page, Locator } from '@playwright/test';

export class HomePage extends BasePage {
  readonly productLinks: Locator;
  readonly productCards: Locator;
  readonly phonesCategory: Locator;
  readonly laptopsCategory: Locator;
  readonly monitorsCategory: Locator;

  constructor(page: Page) {
    super(page);
    this.productLinks = page.locator('.card-title a');
    this.productCards = page.locator('.card.h-100');
    this.phonesCategory = page.locator('a#itemc', { hasText: 'Phones' });
    this.laptopsCategory = page.locator('a#itemc', { hasText: 'Laptops' });
    this.monitorsCategory = page.locator('a#itemc', { hasText: 'Monitors' });
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

  async selectCategory(category: 'Phones' | 'Laptops' | 'Monitors'): Promise<void> {
    const locator =
      category === 'Phones'
        ? this.phonesCategory
        : category === 'Laptops'
          ? this.laptopsCategory
          : this.monitorsCategory;

    const before = await this.getProductNames();
    await locator.click();

    // Demoblaze replaces the product grid asynchronously after the category click.
    await this.page.waitForFunction(
      (previous) => {
        const current = Array.from(document.querySelectorAll('.card-title a')).map(
          (el) => el.textContent?.trim() || ''
        );
        return current.length > 0 && current.join('|') !== previous.join('|');
      },
      before,
      { timeout: 10_000 }
    );
  }
}
