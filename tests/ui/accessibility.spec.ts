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
});
