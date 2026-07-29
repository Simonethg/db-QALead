import { BasePage } from './base.page';
import type { Page, Locator } from '@playwright/test';
import type { UserCredentials } from '../types';

export class LoginPage extends BasePage {
  readonly loginModal: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.loginModal = page.locator('#logInModal');
    this.usernameInput = page.locator('#loginusername');
    this.passwordInput = page.locator('#loginpassword');
    this.loginButton = page.locator('#logInModal button.btn-primary');
  }

  async openLoginModal(): Promise<void> {
    await this.loginLink.click();
    await this.loginModal.waitFor({ state: 'visible' });
  }

  async login(credentials: UserCredentials): Promise<void> {
    await this.openLoginModal();
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
    await this.welcomeMessage.waitFor({ state: 'visible' });
  }

  async loginWithInvalidCredentials(credentials: UserCredentials): Promise<void> {
    await this.openLoginModal();
    await this.usernameInput.fill(credentials.username);
    await this.passwordInput.fill(credentials.password);
    await this.loginButton.click();
  }
}
