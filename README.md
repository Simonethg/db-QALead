# QA Automation Lead — Technical Challenge

This repository contains the working automation project for the Lead QA Automation Engineer role at Dualboot Partners.

It demonstrates a Playwright + TypeScript automation framework against [Demoblaze](https://www.demoblaze.com) for UI tests and [RESTful Booker](https://restful-booker.herokuapp.com) for API tests. The project is designed with maintainability, traceability, and SOC 2 / ISTQB / ADA-aligned quality practices in mind.

## Project structure

```
db-QALead/
├── .github/workflows/test.yml    # CI workflow
├── docs/                         # Strategy, scenarios, AI usage log, defect reports
├── src/
│   ├── config/                   # Environment configuration
│   ├── fixtures/                 # Test data and Playwright fixtures
│   ├── helpers/                  # API client and reusable helpers
│   ├── pages/                    # Page Object Model classes
│   └── types/                    # Shared TypeScript types
├── tests/
│   ├── ui/                       # UI end-to-end tests
│   └── api/                      # API integration tests
├── .env.example                  # Template for credentials and environment variables
├── playwright.config.ts          # Playwright configuration
└── tsconfig.json                 # TypeScript configuration
```

## Prerequisites

- Node.js 22 LTS
- npm 10+
- A free Demoblaze account (used for authenticated UI tests)

## Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/Simonethg/db-QALead.git
   cd db-QALead
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Install Playwright browsers:

   ```bash
   npx playwright install chromium
   ```

4. Create your `.env` file from the template:

   ```bash
   cp .env.example .env
   ```

5. Fill in your Demoblaze credentials in `.env`:

   ```dotenv
   DEMOBLAZE_USERNAME=your_username
   DEMOBLAZE_PASSWORD=your_password
   RESTFUL_BOOKER_BASE_URL=https://restful-booker.herokuapp.com
   NODE_ENV=staging
   ```

   > **Never commit the `.env` file.** It is already ignored in `.gitignore`.

## Running the tests

Run the full suite:

```bash
npm test
```

Run only UI tests:

```bash
npx playwright test tests/ui
```

Run only API tests:

```bash
npx playwright test tests/api
```

Run in headed mode (to see the browser):

```bash
npm run test:headed
```

Open the interactive UI mode:

```bash
npm run test:ui
```

## Code quality

```bash
npm run lint          # ESLint
npm run format:check  # Prettier check
npm run typecheck     # TypeScript type check
```

## Test coverage

### UI tests

- `login.spec.ts` — logs in with valid credentials and verifies the welcome message.
- `login-negative.spec.ts` — invalid credentials and empty credentials (negative/edge cases).
- `logout.spec.ts` — logs out and restores guest navigation.
- `catalog.spec.ts` — filters the product grid by category (Laptops).
- `cart.spec.ts` — adds a product to the cart and removes it.
- `purchase.spec.ts` — adds a product to the cart and completes the checkout flow.
- `accessibility.spec.ts` — axe-core WCAG 2.1 AA scans scoped to the login modal and the cart region.

### API tests

- `auth.spec.ts` — authentication happy path (token issued) and invalid credentials.
- `booking.spec.ts` — create/retrieve, update, delete-then-404, missing resource 404, and invalid payload (documents DEF-002 / HTTP 500).

### Negative and edge cases (justification)

Invalid login is covered because authentication is a high-risk control: a wrong password must fail closed and must not expose a session. Empty credentials check client-side validation messaging. The invalid booking payload asserts the current non-success status and records the preferred `400` once the API is fixed.

## Optional walkthrough

**Recorded demo (Deliverable 5):** [Loom walkthrough](https://www.loom.com/share/2b79ae7e64f24b2db1a7f11ac59755e9)

The video covers the README, strategy, CI/PR approach, scenarios, defect reports, UI/API structure, and AI usage.

## Design decisions

- **Page Object Model:** keeps selectors and page actions separate from test logic, making tests readable and maintenance easier.
- **Fixtures:** provide typed page objects and an API client to every test, reducing boilerplate.
- **Environment configuration:** `NODE_ENV` selects URLs; both `staging` and `production` currently point to the public demo apps, but the structure supports real environment separation.
- **Reporting:** Playwright HTML reports and traces are generated on failure. CI uploads them as artifacts for debugging without local reproduction.
- **Accessibility:** axe-core is integrated into the UI suite to demonstrate ADA/WCAG verification.
- **Self-contained API tests:** each API test creates its own data and cleans it up.

## Deliberate omissions

- Multi-browser execution is configured only for Chromium to keep the suite fast on a shared public environment. Firefox and WebKit can be added by extending `playwright.config.ts`.
- Advanced visual regression and performance tests are out of scope for this challenge.
- The Demoblaze account is a throwaway test account; production-grade secrets management (e.g., a secret manager) would be used in a real Meridian setup.

## CI/CD

The GitHub Actions workflow (`test.yml`) runs on every push and pull request to `main`, plus a nightly scheduled run. It has three jobs:

1. **Quality gates** — lint, format check, and TypeScript type check.
2. **UI tests** — run the UI suite in headless Chromium, uploading the report on failure.
3. **API tests** — run the API suite independently.

Release blockers and override rules for Meridian are described in the strategy document (`docs/qa-automation-strategy.md`).

## Defect reports

Real defects found during test execution are documented in `docs/defects/` as examples of QA defect reporting and triage:

- `docs/defects/001-demoblaze-login-modal-accessibility.md` — WCAG 2.1 AA violations on the Demoblaze login modal.
- `docs/defects/002-restful-booker-invalid-payload-500.md` — RESTful Booker returns HTTP 500 instead of 400 for invalid booking payloads.

Each report includes severity, steps to reproduce, expected vs. actual behavior, evidence, impact, and recommended remediation. In a production setup these would be tracked in the issue tracker and linked to CI failures.

## What I would do next with more time

- Add contract tests or schema validation for RESTful Booker responses (beyond the current status assertions).
- Expand accessibility coverage to the product detail page and checkout modal.
- Add fixtures that seed and reset test data in a dedicated environment.
- Integrate test results with a test case management tool and Slack notifications.
- Add mutation testing or property-based tests for the billing engine once Meridian APIs are available.

## License

This project is a technical challenge submission and is not intended for production use.
