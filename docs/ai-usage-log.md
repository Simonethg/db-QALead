# AI Usage Log

**Role:** Lead QA Automation Engineer technical challenge  
**Author:** Candidate  
**Date:** July 2026

## Multi-agent setup (Loop Engineering)

Work ran as a closed loop (discover → plan → execute → verify → memorize) with five roles:

| Agent | Who | What they do |
|-------|-----|--------------|
| **Product Owner / Strategy Lead** | Human | Approves scope, trade-offs, omissions, and final deliverables; resolves ambiguity. |
| **Executor** | Kimi Code (main) | Builds code, drafts documents, runs commands, iterates on failures. |
| **Technical Investigator** | Kimi Code (subagent) | Resolves unknowns: API behavior, DOM selectors, tool versions — read-only unless told otherwise. |
| **Independent Verifier** | Kimi Code (subagent) or human | Checks deliverables against `VISION.md` rubrics without being the producer. |
| **Memory Keeper** | Executor role | Maintains `MEMORY.md`, the decision log, and this AI usage log. |

Supporting tools: `pdftotext`, GitHub CLI, Playwright HTML report, axe-core, and GitHub Actions logs.

## What was delegated to AI

- Repository inspection and extraction of the challenge brief from PDF.
- Scaffolding of the Playwright + TypeScript project (page objects, fixtures, helpers, CI, lint/typeconfig).
- Drafting of strategy, scenarios, defect reports, README, and this log in Markdown.
- Iterative debugging from command output (module resolution, types, navigation, accessibility assertions, API status codes).
- Independent Verifier review of the suite against `VISION.md`.

## What remained human (Product Owner)

- Scope, trade-offs, and final wording of the strategy and written scenarios.
- Compliance framing (SOC 2 Type II, ISTQB, ADA/WCAG).
- Target choices: Demoblaze + RESTful Booker, npm, Chromium, headless in CI.
- Credential handling via `.env` and GitHub secrets — never committed.
- Approval of git push, secrets, and defect issues #1 and #2.
- Final wording of deliverable Markdown in `docs/` (strategy, scenarios, AI usage log).

## Where AI was wrong or incomplete

- Fetching the job posting and a referenced article returned empty shells or login pages; the human pasted the source text.
- First runs failed for scaffold gaps: UI specs skipped base URL navigation; missing `OrderDetails` type; Demoblaze login modal had real WCAG violations; RESTful Booker returned **500** for an invalid payload where **400** was assumed. Each issue was fixed from real output before claiming green.
- The Independent Verifier found `package-lock.json` ignored and traces missing from CI artifacts; both were corrected.

## How work was verified

Local gates: `npm run lint`, `typecheck`, `format:check`, and `npm test` (6 tests). CI workflow `QA Automation Suite` passed after secrets were set (run `30414309392`). Defects live in `docs/defects/` and as GitHub issues.

## Principles not delegated

Final judgment on strategy and scenarios; no credentials in the repo; no git mutations without Product Owner approval during the build; accessibility findings reported as product evidence, not silenced for a green suite.
