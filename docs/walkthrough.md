# Deliverable 5 — Optional Walkthrough

**Audience:** Dualboot Partners hiring panel (technical)  
**Duration:** 8–10 minutes live, or a short recorded walkthrough  
**Repo:** https://github.com/Simonethg/db-QALead  
**Language:** English (delivery); this file is the speaking script

Use this as a speaking outline, not a slide deck. Prefer a live demo; fall back to the latest green GitHub Actions run and the Playwright HTML report if Demoblaze flakes.

---

## Agenda (time box)

| Min | Section | Goal |
|-----|---------|------|
| 0:00–0:30 | Opening | Frame the package |
| 0:30–1:30 | Strategy | Risk → tooling → compliance |
| 1:30–3:00 | Architecture | How the suite is built to last |
| 3:00–7:00 | Live evidence | Run or show 16 tests + defects |
| 7:00–8:00 | AI usage | Honest boundaries |
| 8:00–9:00 | Scenarios + close | Judgment under constraint |
| 9:00–10:00 | Q&A | Trade-offs |

---

## 0. Opening (30 seconds)

> This submission is a decision-oriented QA automation package for Meridian, plus a runnable Playwright + TypeScript suite against public targets. I will not walk every file. I will show how strategy, code, CI evidence, defect triage, and AI usage fit together.

Point at the five deliverables in the README / `docs/`:

1. Strategy brief  
2. Working automation project (16 tests)  
3. AI usage log  
4. Two written scenarios  
5. This walkthrough  

---

## 1. Strategy in one minute

Open `docs/qa-automation-strategy.md` (or the Notion PDF export).

Speak these three beats only:

1. **Risk first** — billing engine, usage ingestion, payments, webhooks, SSO, exports. Ranked by business impact and escape risk; billing is the priority because it already failed in production in the case study.
2. **Stack** — Playwright + TypeScript, axe-core, GitHub Actions, Greptile for review scale, ship/show/ask merge policy.
3. **Compliance thread** — SOC 2 evidence from CI artifacts + commit SHA; ISTQB risk-based coverage; ADA/WCAG scans with triage, not a greenwashed suite.

Call out one deliberate omission (multi-browser matrix, Allure on day one, or a dedicated QA env in month one) and point to the README “Deliberate omissions” section.

---

## 2. Architecture (≈90 seconds)

Open `ARCHITECTURE.md` and the folder tree.

| Path | One-line point |
|------|----------------|
| `src/pages/` | Page objects expose actions, not business assertions |
| `src/fixtures/` + `src/helpers/` | Typed fixtures and API client; less boilerplate |
| `src/config/environments.ts` | Multi-env shape; one public env used here |
| `tests/ui/` + `tests/api/` | Intent separated by layer |
| `.github/workflows/test.yml` | Fail-fast lint/typecheck, then UI and API jobs; artifacts on failure |
| `docs/defects/` | Real findings with severity, evidence, remediation |

Optional one-liner: “Selectors prefer roles and stable IDs; CSS classes are a last resort.”

---

## 3. Live evidence (3–4 minutes)

### Preferred path — run locally

```bash
cp .env.example .env   # fill Demoblaze credentials; never show secrets on screen
npm ci
npx playwright install chromium
npm test
```

Expected result: **16 passed** (7 API + 9 UI), plus prior `lint` / `typecheck` / `format:check` if you show quality gates.

### Backup path — CI

Open the latest green `QA Automation Suite` run on GitHub Actions. Show that secrets are injected, jobs fail fast on lint/type errors, and failure artifacts include report + `test-results/` traces.

### What to demonstrate (pick one from each row)

| Category | Spec | What to say |
|----------|------|-------------|
| UI happy path | `tests/ui/login.spec.ts` or `purchase.spec.ts` | End-to-end user intent, auto-waiting, readable failure |
| Negative / edge | `tests/ui/login-negative.spec.ts` | Auth must fail closed; empty fields covered |
| Catalog / cart | `catalog.spec.ts` / `cart.spec.ts` | Browse and cart mutation without full checkout |
| API happy + update | `tests/api/booking.spec.ts` | Self-contained create → update → cleanup |
| API auth | `tests/api/auth.spec.ts` | Token issued; bad credentials return `Bad credentials` |
| API defect | invalid payload in `booking.spec.ts` | Asserts current **500**; preferred **400** — see DEF-002 / issue #2 |
| Accessibility | `tests/ui/accessibility.spec.ts` | Login modal scan finds critical/serious WCAG issues (DEF-001 / issue #1); cart scan is scoped to the cart region |

Emphasize: a failure leaves screenshot + trace so someone who did not write the test can debug.

---

## 4. AI usage (≈1 minute)

Open `docs/ai-usage-log.md` if present, otherwise `AI_USAGE_LOG.md`.

- **Agents:** Product Owner (human), Executor, Technical Investigator, Independent Verifier, Memory Keeper — closed loop discover → plan → execute → verify → memorize.
- **Delegated:** scaffolding, iteration from command output, Markdown drafts.
- **Human-owned:** strategy arguments, scenarios, credentials, final PDF wording.
- **AI miss:** assumed HTTP 400 for invalid booking; API returned 500. Verifier also caught ignored `package-lock.json` and missing CI traces — both fixed before claiming done.

---

## 5. Scenarios + close (≈1 minute)

Open `docs/scenarios.md` only if asked; otherwise summarize:

1. **Shared staging conflict** — isolate data per test, quiet-window schedule, lightweight guardrails; do not wait six months for a dedicated env to regain trust in nightly.
2. **Testability with a senior engineer** — hooks are production observability (admin trigger, stable selectors, seed), not “QA pollution”; unit tests alone do not cover the tenant export path that already escaped.

Close:

> The package is transfer-ready: README, conventions, CI gates, defect examples, and an honest AI log. If hired, next I would harden isolation for shared staging, deepen billing-risk coverage, and keep accessibility in the definition of done.

Invite questions on Greptile, ship/show/ask, or public-demo flakiness.

---

## Recording tips (if submitting a video)

- Cap at **5–8 minutes**; follow the agenda above and cut Q&A.
- Show terminal + IDE + one CI run URL; blur `.env`.
- Narrate *why* before *what* on each demo beat.
- End on defects #1/#2 as proof that the suite finds and reports real issues instead of forcing green.

---

## Demo checklist (day of)

- [ ] Node 22 + `npm ci` + Chromium installed  
- [ ] `.env` present; secrets never visible on shared screen  
- [ ] Latest branch / `main` pulled; local `npm test` green (16)  
- [ ] CI green; know the Actions run URL  
- [ ] Issues [#1](https://github.com/Simonethg/db-QALead/issues/1) and [#2](https://github.com/Simonethg/db-QALead/issues/2) open for defect discussion  
- [ ] PDFs (strategy, scenarios, AI log) ready if Notion is the submission channel  
- [ ] Backup: HTML report + Actions URL if Demoblaze flakes mid-demo  
