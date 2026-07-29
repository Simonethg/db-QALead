import type { Page, Locator } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly navbar: Locator;
  readonly loginLink: Locator;
  readonly signupLink: Locator;
  readonly logoutLink: Locator;
  readonly cartLink: Locator;
  readonly welcomeMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.navbar = page.locator('#navbarExample');
    this.loginLink = page.locator('#login2');
    this.signupLink = page.locator('#signin2');
    this.logoutLink = page.locator('#logout2');
    this.cartLink = page.locator('#cartur');
    this.welcomeMessage = page.locator('#nameofuser');
  }

  async open(path = ''): Promise<void> {
    await this.page.goto(path);
  }

  async goToCart(): Promise<void> {
    await this.cartLink.click();
  }

  async isLoggedIn(): Promise<boolean> {
    return await this.welcomeMessage.isVisible();
  }
}
