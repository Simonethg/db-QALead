# Optional Walkthrough — Guidance Script

**Audience:** Dualboot Partners hiring panel (technical)  
**Duration:** ~8–10 minutes  
**Repo:** https://github.com/Simonethg/db-QALead

Use this as a speaking outline, not a slide deck. Keep demos live when possible; fall back to the latest CI run and Playwright HTML report if Demoblaze is unstable.

---

## 0. Opening (30 seconds)

- This submission is a decision-oriented QA automation package for Meridian, plus a runnable Playwright suite.
- Goal of the walkthrough: show how strategy, code, CI evidence, and defect triage fit together — not every line of every file.

## 1. Strategy in one minute

Open `docs/qa-automation-strategy.md` (or the PDF export).

- **Risk first:** billing engine, usage ingestion, payments, webhooks, SSO, exports — ranked by impact and escape risk.
- **Stack:** Playwright + TypeScript, axe-core, GitHub Actions, Greptile for review scale; ship/show/ask merge policy.
- **Compliance thread:** SOC 2 evidence from CI artifacts + commit SHA; ISTQB risk-based coverage; ADA/WCAG via automated scans and triage.

Say out loud what was deliberately left out of the strategy (e.g. full multi-browser matrix, Allure as day-one, dedicated QA env in month one) and point to the README “omissions” section.

## 2. Live project structure (1–2 minutes)

Open the repo root and `ARCHITECTURE.md` / folder tree.

Highlight only:

| Path | Why it matters |
|------|----------------|
| `src/pages/` | Page objects — actions, not assertions |
| `src/fixtures/` + `src/helpers/` | Reuse and API client |
| `src/config/environments.ts` | Multi-env ready; one env used here |
| `tests/ui/` + `tests/api/` | Clear separation of intent |
| `.github/workflows/test.yml` | Fail-fast lint/typecheck, then tests; artifacts on failure |
| `docs/defects/` | Real findings with severity and remediation |

## 3. Run or show evidence (3–4 minutes)

**Preferred:** run locally.

```bash
cp .env.example .env   # credentials already filled for the demo account
npm test
```

If time is short, open the green GitHub Actions run and the Playwright HTML report artifact.

Walk one example from each category:

1. **UI happy path** — login or purchase (`tests/ui/`).
2. **Negative case** — invalid login credentials (justify: auth is high risk; wrong password must fail closed).
3. **API** — booking create (happy) + invalid payload (error); note the documented 500 vs expected 4xx in `docs/defects/002-…`.
4. **Accessibility** — login modal scan with axe-core; show that critical/serious findings are reported, not hidden (`docs/defects/001-…` / issue #1).

Emphasize: failures leave screenshot + trace; CI uploads `test-results/` so someone who did not write the test can debug.

## 4. AI usage (1 minute)

Open `docs/ai-usage-log.md`.

- AI scaffolded and iterated; humans owned strategy arguments, credentials, and final PDF wording.
- Call out one AI miss (assumed HTTP 400; Demoblaze returned 500 / real a11y violations) and how verification caught it.

## 5. Close (30–60 seconds)

- Package is transfer-ready: README, conventions, CI gates, defect examples.
- Next steps if hired: harden isolation for shared staging, expand billing risk coverage, keep accessibility in the definition of done.
- Invite questions on trade-offs (Greptile, ship/show/ask, public demo targets).

---

## Demo checklist (day of)

- [ ] Node 22 + `npm install` + Chromium installed
- [ ] `.env` present; never share screen with secrets visible — use redacted terminal or CI
- [ ] Latest `main` pulled; CI green
- [ ] Issues #1 and #2 open for defect discussion
- [ ] PDF exports of strategy, scenarios, and AI log ready if Notion is the submission channel
- [ ] Backup plan: HTML report + Actions run URL if Demoblaze flakes mid-demo
