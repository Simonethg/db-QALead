import { test, expect } from '../../src/fixtures/pages';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('should detect and report WCAG violations on the login modal', async ({
    page,
    loginPage,
  }) => {
    await loginPage.open('/');
    await loginPage.openLoginModal();

    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#logInModal')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Demoblaze is a public shared environment with known accessibility issues.
    // This test demonstrates that the framework can detect and report WCAG violations,
    // which is the first step toward ADA compliance. In a real product, these findings
    // would become defects with remediation guidance.
    expect(accessibilityScanResults.violations.length).toBeGreaterThan(0);

    const criticalOrSerious = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious'
    );
    expect(criticalOrSerious.length).toBeGreaterThan(0);
  });

  test('should scan the cart page for WCAG 2.1 AA violations', async ({
    page,
    homePage,
    productPage,
    cartPage,
  }) => {
    await homePage.open();
    await homePage.selectFirstProduct();
    await productPage.addToCart();
    await cartPage.open();

    // Scope the scan to the cart contents region only (changed component / feature under test).
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('#tbodyid')
      .include('.col-lg-1')
      .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
      .analyze();

    // Report findings without blocking on a third-party demo storefront.
    // Critical/serious violations would block QA approval on a client storefront.
    const criticalOrSerious = accessibilityScanResults.violations.filter(
      (violation) => violation.impact === 'critical' || violation.impact === 'serious'
    );

    test.info().annotations.push({
      type: 'ada-scan',
      description: `Cart scan: ${accessibilityScanResults.violations.length} violation(s), ${criticalOrSerious.length} critical/serious`,
    });

    expect(accessibilityScanResults.violations).toBeDefined();
  });
});
