# AI Usage Log

**Role:** Lead QA Automation Engineer technical challenge  
**Author:** Candidate  
**Date:** July 2026

## Tools used

Kimi Code / Cursor agents as Executor (implementation), Technical Investigator (API and DOM unknowns), and Independent Verifier (rubric checks). Supporting tools: `pdftotext`, GitHub CLI, Playwright HTML report, axe-core, and GitHub Actions logs.

## What was delegated to AI

- Repository inspection and extraction of the challenge brief from PDF.
- Scaffolding of the Playwright + TypeScript project (page objects, fixtures, helpers, CI, lint/typeconfig).
- Drafting of strategy, scenarios, defect reports, README, and this log in Markdown.
- Iterative debugging from command output (module resolution, types, navigation, accessibility assertions, API status codes).
- Independent Verifier review of the suite against `VISION.md`.

## What remained human

- Scope, trade-offs, and final wording of the strategy and written scenarios.
- Compliance framing (SOC 2 Type II, ISTQB, ADA/WCAG).
- Target choices: Demoblaze + RESTful Booker, npm, Chromium, headless in CI.
- Credential handling via `.env` and GitHub secrets — never committed.
- Approval of git push, secrets, and defect issues #1 and #2.
- Final PDF export in Notion from Markdown drafts.

## Where AI was wrong or incomplete

- Fetching the Notion job posting and a referenced article returned empty shells or login pages; the human pasted the source text.
- First runs failed for scaffold gaps: UI specs skipped base URL navigation; missing `OrderDetails` type; Demoblaze login modal had real WCAG violations; RESTful Booker returned **500** for an invalid payload where **400** was assumed. Each issue was fixed from real output before claiming green.
- The Independent Verifier found `package-lock.json` ignored and traces missing from CI artifacts; both were corrected.

## How work was verified

Local gates: `npm run lint`, `typecheck`, `format:check`, and `npm test` (6 tests). CI workflow `QA Automation Suite` passed after secrets were set (run `30414309392`). Defects live in `docs/defects/` and as GitHub issues.

## Principles not delegated

Final judgment on strategy and scenarios; no credentials in the repo; no git mutations without approval during the build; accessibility findings reported as product evidence, not silenced for a green suite.
