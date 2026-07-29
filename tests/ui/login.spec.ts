import { test, expect } from '../../src/fixtures/pages';
import { assertCredentials } from '../../src/fixtures/test-data';

test.describe('Login', () => {
  test('should log in with valid credentials', async ({ page, loginPage }) => {
    const credentials = assertCredentials();

    await loginPage.open('/');
    await loginPage.openLoginModal();
    await loginPage.usernameInput.fill(credentials.username);
    await loginPage.passwordInput.fill(credentials.password);
    await loginPage.loginButton.click();

    await expect(loginPage.welcomeMessage).toContainText(`Welcome ${credentials.username}`);
    await expect(page.locator('#logout2')).toBeVisible();
  });
});
