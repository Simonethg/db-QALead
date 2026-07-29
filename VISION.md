# VISION.md — QA Automation Lead Technical Challenge

## Purpose

This repository contains the submission for the Lead QA Automation Engineer role at Dualboot Partners.
It demonstrates how I would establish a QA automation function for a B2B SaaS platform (Meridian case study)
and includes a runnable automation project against a public demo application.

## Definition of done

The challenge is complete when all five deliverables are present, runnable, and reviewable:

### Deliverable 1 — QA automation strategy

- File: `docs/qa-automation-strategy.md` (max 4 pages when printed).
- A decision document written for Meridian's CTO, not a textbook chapter.
- Covers the seven required points: risk map, tooling, framework architecture, coverage strategy,
  test data and environments, CI/CD and quality gates, roadmap and handover.
- Explicitly addresses SOC 2 Type II evidence and traceability, ISTQB-aligned test practices,
  and ADA/WCAG accessibility compliance.

### Deliverable 2 — Working automation project

- Located at the root of this repository.
- Defects found during test execution are documented in `docs/defects/` with severity, evidence, impact, and recommended actions.
- Stack: Playwright with TypeScript.
- Two UI end-to-end specs on Demoblaze.
- One API spec with at least one happy path and one error case.
- One negative or edge case, justified in the README.
- One accessibility check using axe-core or Playwright's accessibility scanning,
  demonstrating ADA/WCAG compliance verification.
- Structure shows conventions: page objects or equivalent, fixtures, reusable helpers,
  configuration separated from test logic.
- Configuration for more than one environment, even though only one exists here.
- GitHub Actions workflow that runs the suite, with trigger strategy expressed in it.
- Reporting configured so a failure is legible to someone who did not write the test.
- README with: how to run it, design decisions, what was deliberately left out, and next steps.

### Deliverable 3 — AI usage log

- File: `docs/ai-usage-log.md` (max 1 page when printed).
- Honest account of how AI was used.
- Includes what was delegated, what was kept human, tools used, at least one case where AI output
  was wrong or misleading, how verification was done, and what was not delegated on principle.

### Deliverable 4 — Two written scenarios

- File: `docs/scenarios.md` (max 400 words each).
- Scenario 1: the shared staging environment conflict.
- Scenario 2: the testability discussion with a senior engineer.

### Deliverable 5 — Optional walkthrough

- Not required.
- Recorded Loom demo linked from the README and `docs/walkthrough.md`.

## Quality standards

### Code quality

- TypeScript with strict checks enabled.
- ESLint + Prettier configured and passing in CI.
- No `any` without explicit justification in a comment.
- Page objects and helpers must be reusable across specs.
- Selectors must prefer user-facing attributes (`data-testid`, semantic roles) over brittle XPath/CSS.

### Test quality

- Every spec has a single, explicit assertion intent.
- Happy path and error path must be covered where required.
- Flaky waits are forbidden; use Playwright auto-waiting and explicit locators.
- Each failing test leaves a trace, screenshot, and readable error message.
- Tests must run locally and in CI without human intervention.

### Documentation quality

- README explains how to run, design decisions, deliberate omissions, and next steps.
- Strategy doc is a decision brief, not a textbook; max 4 pages.
- Scenarios max 400 words each.
- AI usage log max 1 page and honest.

### CI/CD quality

- GitHub Actions runs lint, type check, and tests on PR and on schedule.
- Workflow fails fast on lint/type errors before running tests.
- Test artifacts (report, traces) uploaded on failure.

## Compliance requirements

### SOC 2 Type II

- Every test run produces immutable evidence: timestamp, commit SHA, environment, results, and artifacts.
- Quality gates and release decisions are recorded and attributable.
- Access to test environments and secrets follows least-privilege and is documented.
- Changes to tests, framework, and CI workflows are traceable through version control.

### ISTQB-aligned practices

- Risk-based prioritization drives coverage decisions.
- Test design separates intent (what is being verified) from implementation (how).
- Defect triage includes severity, business impact, and root-cause category.
- Test reporting communicates coverage, confidence, and residual risk to non-QA stakeholders.

### ADA / WCAG accessibility

- Automated accessibility checks run as part of the UI suite.
- Keyboard navigation and screen-reader-friendly selectors are preferred.
- Critical pages are scanned for WCAG 2.1 Level AA violations.
- Accessibility findings are reported with clear remediation guidance.

## Constraints

- Time budget: 5 to 7 hours of actual work within a 48-hour window.
- Public shared environment (Demoblaze) may be flaky; design must account for that.
- No credentials committed; use `.env.example` and environment variables.
- Final audience is technical (CTO, engineers, DevOps) but not necessarily QA specialists.
- All deliverables and code comments in English.
