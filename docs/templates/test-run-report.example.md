# Example — Test Run Report (filled)

Illustrative filled copy of `test-run-report.md` for a green local/CI-style run against the public demo targets. Replace with real values for production use.

---

# Test Run Report — Nightly smoke · db-QALead

| Field | Value |
|-------|-------|
| **Report ID** | `TR-20260729-001` |
| **Date / time (UTC)** | 2026-07-29T16:00:00Z |
| **Trigger** | `nightly` |
| **Result** | PASS WITH OBSERVATIONS |
| **Release recommendation** | Go with known risks |
| **Prepared by** | QA Automation Lead (candidate submission) |
| **Reviewed by** | N/A |

## 1. Traceability (SOC 2 evidence)

| Field | Value |
|-------|-------|
| **Repository** | Simonethg/db-QALead |
| **Commit SHA** | `1ad9232` (example — use full SHA in real runs) |
| **Branch / PR** | `main` / N/A |
| **CI run URL** | https://github.com/Simonethg/db-QALead/actions |
| **Environment** | staging (`NODE_ENV=staging`) |
| **UI base URL** | https://www.demoblaze.com |
| **API base URL** | https://restful-booker.herokuapp.com |
| **Browser / runtime** | Chromium (Playwright Desktop Chrome) · Node 22 · Playwright 1.62 |
| **Secrets source** | GitHub Actions secrets (UI) / N/A for API-only jobs |
| **Artifacts** | Playwright HTML + `test-results/` uploaded on failure (14-day retention) |

## 2. Executive summary

Full UI and API automated suites completed successfully against public shared environments. No new product blockers beyond previously documented accessibility and API-contract defects. Residual risk is environment flake on Demoblaze and known WCAG violations on the login modal.

**Confidence in this build:** Medium — public shared targets; known DEF-001 / DEF-002 accepted as observations for this demo submission.

## 3. Scope

### In scope

- Quality gates: lint, format, typecheck  
- UI end-to-end (login, negative login, logout, catalog, cart, purchase, accessibility)  
- API (health, auth, authorization, booking CRUD/query, invalid payload)

### Out of scope

- Firefox / WebKit, visual regression, performance, load

### Risk areas exercised

| Risk area | Covered? | Specs / notes |
|-----------|----------|---------------|
| Authentication / session | Yes | login, login-negative, logout, API auth/authz |
| Purchase / checkout | Yes | purchase, cart |
| API booking CRUD + authz | Yes | booking, booking-query, authorization, health |
| Accessibility (ADA/WCAG) | Yes | login modal (blocking findings reported); cart scoped scan |
| Catalog browse | Yes | catalog category filter |

## 4. Results summary

| Suite | Planned | Passed | Failed | Flaky / retried | Skipped | Duration |
|-------|---------|--------|--------|-----------------|---------|----------|
| Quality gates | 3 | 3 | 0 | 0 | 0 | ~30s |
| UI | 9 | 9 | 0 | 0 | 0 | ~15s |
| API | 14 | 14 | 0 | 0 | 0 | ~2s |
| **Total** | **26** | **26** | **0** | **0** | **0** | **~3m** |

**Pass rate:** 100% (gates + tests)

> Counts assume the expanded API suite is on the branch under test. Adjust to the commit you actually ran.

## 5. Failed / blocked tests

None.

## 6. ADA / WCAG accessibility findings

| Component / selector | Viewport | Critical | Serious | Moderate | Minor | Gate |
|----------------------|----------|----------|---------|----------|-------|------|
| Login modal `#logInModal` | 1440 | ≥1 | ≥1 | — | — | Block (documented DEF-001) |
| Cart `#tbodyid` | 1440 | 0* | 0* | obs. | obs. | Observe |

\*Exact counts vary; cart scan records findings via test annotations without failing the suite on third-party noise.

**ADA summary:** Login modal has critical/serious WCAG 2.1 AA violations (contrast, image-alt, etc.) tracked as DEF-001 / GitHub issue #1. These block ADA approval for an authenticated client storefront; accepted as known risk on this public demo target.

## 7. Observations (non-blocking)

- Demoblaze is a shared public app; cart/add-to-cart can flake without dialog waits (mitigated in page object).  
- RESTful Booker invalid payload returns HTTP 500 instead of 400 (DEF-002 / issue #2).  
- API dataset resets periodically; tests create and clean their own data.

## 8. New or updated defects

| ID | Title | Severity | Status | Link |
|----|-------|----------|--------|------|
| DEF-001 | Login modal WCAG 2.1 AA violations | High | Open | `docs/defects/001-…` · issue #1 |
| DEF-002 | Invalid booking payload returns 500 | Medium | Open | `docs/defects/002-…` · issue #2 |

## 9. Residual risk and recommendation

| Risk | Likelihood | Impact | Mitigation / follow-up |
|------|------------|--------|------------------------|
| Demo-site flake | Medium | Low (CI retry) | Retries in CI; harden waits |
| Known a11y blockers on demo | High | N/A for demo / High for real storefront | DEF-001 remediation on real product |
| API validation 500 | Medium | Medium (contract clarity) | DEF-002; assert current status + preferred 400 |

**Release recommendation:** Go with known risks  
**Rationale:** Automated gates and suites are green; open defects are documented, attributed, and do not represent undocumented escape risk for this challenge submission.  
**Override:** N/A

## 10. Attachments checklist

- [x] CI run URL (or local command evidence)
- [x] Playwright HTML report available on failure path
- [x] Defect links
- [x] Template reference: `docs/templates/test-run-report.md`
