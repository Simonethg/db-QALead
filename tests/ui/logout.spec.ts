import { test, expect } from '../../src/fixtures/pages';
import { assertCredentials } from '../../src/fixtures/test-data';

test.describe('Logout', () => {
  test('should log out and return to the guest navigation state', async ({ page, loginPage }) => {
    const credentials = assertCredentials();

    await loginPage.open('/');
    await loginPage.login(credentials);
    await expect(loginPage.welcomeMessage).toContainText(`Welcome ${credentials.username}`);

    await loginPage.logout();

    await expect(page.locator('#login2')).toBeVisible();
    await expect(page.locator('#logout2')).not.toBeVisible();
    await expect(loginPage.welcomeMessage).not.toBeVisible();
  });
});
