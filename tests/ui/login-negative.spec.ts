import { test, expect } from '../../src/fixtures/pages';
import { testUsers } from '../../src/fixtures/test-data';

test.describe('Login negative cases', () => {
  test('should show an error when logging in with invalid credentials', async ({
    page,
    loginPage,
  }) => {
    let dialogMessage = '';
    page.once('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await loginPage.open('/');
    await loginPage.loginWithInvalidCredentials(testUsers.invalid);

    await expect.poll(() => dialogMessage).toContain('User does not exist');
    await expect(loginPage.welcomeMessage).not.toBeVisible();
  });

  test('should prompt the user when credentials are left empty', async ({ page, loginPage }) => {
    let dialogMessage = '';
    page.once('dialog', async (dialog) => {
      dialogMessage = dialog.message();
      await dialog.accept();
    });

    await loginPage.open('/');
    await loginPage.loginWithInvalidCredentials(testUsers.empty);

    await expect.poll(() => dialogMessage).toMatch(/fill out|Please fill/i);
    await expect(loginPage.welcomeMessage).not.toBeVisible();
  });
});
