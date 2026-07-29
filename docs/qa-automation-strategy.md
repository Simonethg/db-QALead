# QA Automation Strategy for Meridian

**To:** CTO, Meridian  
**From:** Lead QA Automation Engineer  
**Date:** July 2026  
**Subject:** Founding QA automation function — strategy, tooling, and 90-day roadmap

## 1. Risk map

The highest-risk areas are those where a defect directly impacts revenue, compliance, or customer trust.

| Area | Why it carries the most risk | Example failure |
|------|------------------------------|-----------------|
| **Billing engine** | Applies plan rules, proration, tax, credits, and discounts; runs unattended at night. | An incorrect invoice sent to a subset of tenants, as already happened. |
| **Usage ingestion API** | Metered events drive billing; multi-tenant data must remain isolated. | Cross-tenant usage leaks or duplicate events inflate invoices. |
| **Payment collection** | Retry logic and third-party provider failures affect cash collection. | Retries stop too early or charge the wrong payment method. |
| **Webhooks** | Customers rely on real-time invoice/payment notifications. | Missed or duplicate webhooks break customer automation. |
| **SSO and access control** | Enterprise tenants require least-privilege access and audit logs. | A finance user sees another tenant's invoices. |
| **Reporting exports** | Finance teams use CSV/PDF exports for audits and closing. | Exported totals disagree with the dashboard. |

Risks are ranked by business impact, probability of escape, and detectability. The billing engine is the priority because it is batch-oriented, has many input variables, and already produced a production defect.

## 2. Tooling recommendation

**Proposed stack**

| Layer | Tool | Purpose |
|-------|------|---------|
| UI/API end-to-end | Playwright + TypeScript | Fast, reliable cross-browser automation with built-in API and trace support. |
| Unit/integration | Vitest or Jest | Owned by developers; runs in the API codebase. |
| Accessibility | axe-core | WCAG 2.1 AA scanning in CI. |
| CI/CD | GitHub Actions | Existing platform; keeps quality gates close to the code. |
| Reporting | Playwright HTML + Allure (optional) | Readable failures and historical trends. |
| Automated code review | Greptile | Scales human review and provides a confidence score for ship/show/ask decisions. |
| Test data | Factory functions + seed APIs | Fast, deterministic setup per test. |

**What was evaluated**

- **Cypress:** Excellent DX, but weaker multi-tab, multi-origin, and API support than Playwright. Its component testing is stronger, but Meridian needs full-stack coverage more.
- **Selenium/WebDriver:** Too slow and flaky for a team without QA maturity.
- **Playwright:** Best fit because it handles UI, API, and accessibility in one runtime, has automatic waiting, and integrates cleanly with TypeScript and GitHub Actions.

**Why Greptile for code review.** With twelve engineers and no dedicated QA yet, every PR cannot wait for a senior human reviewer. Greptile provides an automated first-pass review with a confidence score that supports the ship/show/ask merge policy. It catches common issues (security patterns, test coverage drift, anti-patterns) and frees humans to focus on architecture and business-risk decisions. It also creates an auditable review record for SOC 2. The score is not a replacement for human judgment on high-risk changes (`ssa: ask`), but it makes low-risk changes (`ssa: ship`) safe to merge without bottlenecks.

**Strongest argument against the choice:** Playwright's rapid release cadence requires keeping browsers and dependencies in sync. This is manageable with a lockfile and scheduled updates.

## 3. Framework architecture

The framework is built in layers so that tests read like user intent and failures are understandable without reading the test code.

```
tests/
  ui/
  api/
src/
  pages/        # Page Object Model: selectors and actions
  helpers/      # API client, retry logic, data factories
  fixtures/     # Shared test data and authenticated contexts
  config/       # Environment URLs and timeouts
```

- **Authentication:** A fixture logs in once per worker and reuses the session. API tests use short-lived tokens.
- **Configuration:** Environment-specific values (URLs, credentials, timeouts) are injected through environment variables; `staging` and `production` configs live in one file.
- **Reporting:** Every failure captures a screenshot, trace, and console logs. The HTML report groups by feature and shows the exact assertion that failed.
- **Patterns:** Tests follow Arrange-Act-Assert. Page objects contain no business assertions. Business assertions live in the spec.

## 4. Coverage strategy

| Layer | What to automate | What stays manual/exploratory | What to deliberately not automate |
|-------|------------------|-------------------------------|-----------------------------------|
| **UI** | Critical tenant journeys: onboarding, plan change, invoice review, payment retry, export download. | New feature first-pass, complex reconciliation workflows, usability. | Third-party payment provider UI, one-off admin tooling, purely cosmetic changes. |
| **API** | Usage ingestion, billing calculation, proration, tax, credits, webhook contracts, auth. | Boundary values that require domain judgment, new endpoints before contract stabilizes. | External provider sandbox quirks that change without notice. |
| **Below API** | Billing engine unit tests, proration formulas, discount rules (developer-owned with QA review). | Complex multi-tenant concurrency scenarios. | Third-party SDK internals. |

The rule is simple: automate what is high-risk, repeatable, and stable; explore what is new, ambiguous, or human-judgment dependent.

## 5. Test data and environments

**Multi-tenancy.** Every test creates its own tenant, user, and data via seed APIs or direct database fixtures. Tests never share state. Tenant IDs are randomized to avoid collisions in parallel runs.

**Single shared staging environment.** This is the biggest operational constraint. Two mitigation layers are needed:

1. **Short term:** Schedule automated runs at known quiet windows and make tests self-contained (create, assert, delete). Flag environment contention in the nightly report.
2. **Medium term:** Ask engineering to add testability hooks: a `/test/seed-tenant` endpoint, a `/test/reset-tenant` endpoint scoped to a test user, and the ability to trigger the billing job on demand. These hooks are gated behind an environment variable that is disabled in production.

**Nightly billing job.** Provide an API or admin hook to run the billing job for a single tenant. Until then, tests validate billing rules at the unit and API layers and rely on a lightweight nightly smoke run for the full batch path.

**Third-party payment provider.** Use the provider's sandbox with a dedicated test merchant. Never use real cards. Mock the provider only for negative scenarios (e.g., declined cards); use the sandbox for happy-path retries.

**What to change in the product:** stable `data-testid` attributes on critical UI elements, idempotent seed endpoints, tenant-scoped reset hooks, and on-demand billing execution for test tenants.

## 6. CI/CD, quality gates and triage

**What runs where**

| Trigger | What runs | Blocks release? |
|---------|-----------|-----------------|
| Pull request | Lint, type check, unit tests, smoke UI/API tests | Yes |
| Nightly | Full regression UI/API suite, accessibility scan, billing smoke | No (alerts team) |
| Pre-release | Full regression plus manual release checklist | Yes |

**Merge policy (ship / show / ask).** PRs are classified by risk so that low-risk changes move fast and high-risk changes get human eyes.

| Label | Requirement | Merge condition |
|-------|-------------|-----------------|
| `ssa: ship` | Green CI + Greptile 5/5 | Immediately, no human review required |
| `ssa: show` | Green CI + Greptile 5/5 | After a 24-hour objection window |
| `ssa: ask` | Green CI + Greptile 5/5 + human approval | When someone approves |

The author applies the label based on a short risk checklist: touches billing/payments/auth (`ask`), changes a shared library or critical path (`show`), everything else (`ship`). Greptile scores code review confidence; a 5/5 means automated review found no concerns. For SOC 2, every merge is attributed to a user and linked to a PR, and `ship` merges are audited monthly to confirm the risk checklist was applied correctly.

**Release override.** Only the CTO can override a blocked release. The override is recorded in the release notes with a risk justification and a follow-up ticket number. This record is part of SOC 2 evidence.

**Failure ownership and flaky tests.**

- Every failure is assigned to the last team that touched the related code.
- A test is flagged flaky if it fails three times in ten runs without a product change. Flaky tests are quarantined within 48 hours, investigated, and fixed or removed.
- A production defect becomes permanent coverage: the fix PR includes a regression test that failed before the fix and passes after it.

**SOC 2 traceability.** Each CI run records commit SHA, timestamp, environment, test results, and artifact URLs. Failed releases include the override decision and owner. Evidence is retained for the audit window.

## 7. Roadmap and handover

**30 days**

- Merge the foundational framework (Playwright + TypeScript + CI) into the main repo.
- Cover the two highest-risk UI journeys: tenant login/SSO and invoice generation/review.
- Cover billing API contracts and webhook signatures.
- Establish the nightly run and the first quality-gate policy.
- Document the framework architecture and contribution guide.

**60 days**

- Add testability hooks to the product with engineering.
- Migrate to a dedicated QA environment or namespace-isolated tenants.
- Expand coverage to payment retries, plan changes, tax rules, and CSV/PDF exports.
- Introduce accessibility gates and contract/schema validation.

**90 days**

- Full regression suite runs green on every release candidate.
- Engineering owns day-to-day test maintenance; QA focuses on strategy and risk.
- Metrics dashboard shows test coverage by risk area, flaky test rate, escaped defects, and mean time to detect.

**Metrics to report**

- Escaped defects per release (primary goal: downward trend).
- Test coverage by risk area, not just line count.
- Flaky test rate and mean time to quarantine.
- Nightly run pass rate and release-cycle time.

**Metric I would refuse to be measured on:** raw number of automated tests. More tests are easy to game; fewer high-value tests are better than many brittle ones.

**Handover to engineering.** The framework uses the same language and tools as the product team. Page objects, fixtures, and helpers are documented. A 90-minute walkthrough and a "first test" pairing session are scheduled for each team. By day 90, the engineering teams open and maintain their own tests, and QA acts as a quality coach.

## Investment and resourcing

**Environment options (monthly estimate)**

| Option | Cost | Trade-off |
|--------|------|-----------|
| Shared staging (current) | $0 | Demo and test data collide; nightly runs are brittle. |
| Isolated tenants/namespaces in existing staging | $200–$500 | Removes most collisions; uses existing infra. |
| Dedicated QA environment | $1,000–$3,000 | Full isolation and on-demand billing runs; highest confidence. |

**Tooling (annual estimate)**

| Tool | Cost | Notes |
|------|------|-------|
| Playwright + TypeScript | $0 | Open source; only CI runner cost. |
| GitHub Actions | $0–$600 | Depends on parallel minutes; likely within free/team tier initially. |
| Greptile | $2,400–$4,800 | ~$20–$40 per engineer/month for automated review confidence. |
| axe-core | $0 | Open source accessibility scanning. |
| Allure / ReportPortal (optional) | $0–$1,200 | Self-hosted is free; SaaS pricing if preferred. |

**Team**

- **Month 0–6:** One Lead QA Automation Engineer (founding role) to build the framework, establish gates, and train the team.
- **Month 6–12:** Add one QA Automation Engineer as coverage grows and engineering takes over day-to-day maintenance.
- **Month 12+:** QA function shifts to strategy, risk assessment, and audit readiness; engineering owns test maintenance.

Total first-year investment is modest compared to the cost of one incorrect invoice or a SOC 2 finding. The priority is to fund the dedicated QA environment and the founding role; tooling costs are secondary.

---

This strategy prioritizes the areas that already hurt Meridian, builds transferable skills in the engineering team, and produces the evidence and traceability required for SOC 2 Type II.
