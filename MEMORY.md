# MEMORY.md — Project Memory

## PROBADO

- Repository `https://github.com/Simonethg/db-QALead` cloned successfully.
- Repo is initially empty except for placeholder `README.md` and an AL/Dynamics `.gitignore`.
- Challenge brief extracted from PDF: 5 deliverables, Playwright + TypeScript preferred, Demoblaze target.

## VERIFICADO

- Deliverables must be in English.
- No committed credentials; use `.env.example` and environment variables.
- Time budget is 5-7 hours of actual work, 48-hour submission window.
- Public shared environments (Demoblaze, RESTful Booker) require robust, self-contained tests.
- Submission must demonstrate awareness of SOC 2 Type II evidence/traceability, ISTQB-aligned practices,
  and ADA/WCAG accessibility compliance.

## ABIERTO

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
- [x] All 6 tests pass locally (lint, typecheck, format check also pass).
- [x] Independent Verifier review completed; package-lock.json unignored and committed, CI trace upload fixed.
- [x] package-lock.json present and not ignored; workflow uses `npm ci`.
- [x] Project pushed to GitHub.
- [x] GitHub secrets `DEMOBLAZE_USERNAME` and `DEMOBLAZE_PASSWORD` configured.
- [x] Defect reports published as GitHub issues #1 and #2.
