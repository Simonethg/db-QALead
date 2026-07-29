# MEMORY.md — Project Memory

## TESTED

- Repository `https://github.com/Simonethg/db-QALead` cloned successfully.
- Repo is initially empty except for placeholder `README.md` and an AL/Dynamics `.gitignore`.
- Challenge brief extracted from PDF: 5 deliverables, Playwright + TypeScript preferred, Demoblaze target.

## VERIFIED

- Deliverables must be in English.
- No committed credentials; use `.env.example` and environment variables.
- Time budget is 5-7 hours of actual work, 48-hour submission window.
- Public shared environments (Demoblaze, RESTful Booker) require robust, self-contained tests.
- Submission must demonstrate awareness of SOC 2 Type II evidence/traceability, ISTQB-aligned practices,
  and ADA/WCAG accessibility compliance.

## VERIFIED (session 2026-07-29)

- Skill `i-have-adhd` (ayghri/i-have-adhd) installed for Cursor via `npx skills add`.
- Paths: `.agents/skills/i-have-adhd/`, `.cursor/skills/i-have-adhd/`, lock in `skills-lock.json`.
- Always-on rule: `.cursor/rules/i-have-adhd.mdc` (`alwaysApply: true`).
- Claude Code marketplace command does not apply here; Cursor uses Agent Skills path.

## OPEN

- [x] Target API: RESTful Booker.
- [x] Demoblaze account: create during setup with temporary email.
- [x] Package manager: npm.
- [x] Browsers: Chromium primary.
- [x] Headless: yes in CI, headed locally.
- [x] Verifier: subagents for code, human for strategy.
- [x] PDFs: human writes final versions in Notion; AI provides Markdown drafts.
- [x] Accessibility test target: login modal; test detects and reports real WCAG violations.
- [x] Negative/edge case: invalid login credentials.
- [x] README location: root.
- [x] All 16 tests pass locally (lint, typecheck, format check also pass).
- [x] Independent Verifier review completed; package-lock.json unignored and committed, CI trace upload fixed.
- [x] package-lock.json present and not ignored; workflow uses `npm ci`.
- [x] Project pushed to GitHub.
- [x] GitHub secrets `DEMOBLAZE_USERNAME` and `DEMOBLAZE_PASSWORD` configured.
- [x] Defect reports published as GitHub issues #1 and #2.
- [x] CI workflow passed in GitHub Actions after configuring secrets.
- [x] Test coverage expanded to 16 passing tests (7 API + 9 UI): auth, update/delete booking, invalid payload (DEF-002), logout, catalog filter, cart add/remove, empty login, cart a11y scan.
- [x] Markdown draft for AI usage log: `docs/ai-usage-log.md` (1-page PDF target).
- [x] Optional walkthrough script: `docs/walkthrough.md` (Deliverable 5).
- [ ] Human exports final PDFs in Notion: strategy (≤4 pages), scenarios, AI usage log (≤1 page).
