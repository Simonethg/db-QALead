# Test Run Report Template

**Purpose.** Standard format for communicating a Playwright suite run to engineering, product, and audit stakeholders.  
**Standards.** ISTQB terminology · SOC 2 Type II evidence · ADA / WCAG 2.1–2.2 AA  
**Audience.** Non-QA readers should understand pass/fail, residual risk, and next actions without opening the test code.

Copy this file to `docs/reports/YYYY-MM-DD-<trigger>-<short-sha>.md` (or paste into Notion) and fill every `{{placeholder}}`.

---

# Test Run Report — {{RUN_TITLE}}

| Field | Value |
|-------|-------|
| **Report ID** | `TR-{{YYYYMMDD}}-{{NNN}}` |
| **Date / time (UTC)** | {{TIMESTAMP_UTC}} |
| **Trigger** | {{local \| pull_request \| push_main \| nightly \| workflow_dispatch \| pre-release}} |
| **Result** | {{PASS \| FAIL \| PASS WITH OBSERVATIONS}} |
| **Release recommendation** | {{Go \| No-Go \| Go with known risks}} |
| **Prepared by** | {{NAME / ROLE}} |
| **Reviewed by** | {{NAME / ROLE or N/A}} |

## 1. Traceability (SOC 2 evidence)

| Field | Value |
|-------|-------|
| **Repository** | {{ORG/REPO}} |
| **Commit SHA** | `{{FULL_OR_SHORT_SHA}}` |
| **Branch / PR** | {{branch}} / {{PR URL or N/A}} |
| **CI run URL** | {{GitHub Actions run URL or N/A}} |
| **Environment** | {{staging \| production \| local}} (`NODE_ENV={{value}}`) |
| **UI base URL** | {{e.g. https://www.demoblaze.com}} |
| **API base URL** | {{e.g. https://restful-booker.herokuapp.com}} |
| **Browser / runtime** | Chromium {{version}} · Node {{version}} · Playwright {{version}} |
| **Secrets source** | {{GitHub Actions secrets \| local .env — never paste values}} |
| **Artifacts** | {{HTML report URL/path · traces · screenshots · retention days}} |

> Immutable evidence for this run: commit SHA + timestamp + environment + result + artifact links above.

## 2. Executive summary

{{2–4 sentences: what was verified, overall outcome, and the single most important residual risk.}}

**Confidence in this build:** {{High \| Medium \| Low}} — {{one-line justification}}.

## 3. Scope

### In scope

- {{e.g. Full UI + API suite / smoke only / changed-component a11y}}

### Out of scope

- {{e.g. Multi-browser matrix, visual regression, performance, manual exploratory}}

### Risk areas exercised (ISTQB risk-based)

| Risk area | Covered? | Specs / notes |
|-----------|----------|---------------|
| Authentication / session | {{Yes/Partial/No}} | {{paths}} |
| Purchase / checkout | {{Yes/Partial/No}} | {{paths}} |
| API booking CRUD + authz | {{Yes/Partial/No}} | {{paths}} |
| Accessibility (ADA/WCAG) | {{Yes/Partial/No}} | {{scoped components}} |
| Other | {{Yes/Partial/No}} | {{paths}} |

## 4. Results summary

| Suite | Planned | Passed | Failed | Flaky / retried | Skipped | Duration |
|-------|---------|--------|--------|-----------------|---------|----------|
| Quality gates (lint / type / format) | {{n}} | {{n}} | {{n}} | {{n}} | {{n}} | {{mm:ss}} |
| UI (`tests/ui`) | {{n}} | {{n}} | {{n}} | {{n}} | {{n}} | {{mm:ss}} |
| API (`tests/api`) | {{n}} | {{n}} | {{n}} | {{n}} | {{n}} | {{mm:ss}} |
| **Total** | **{{n}}** | **{{n}}** | **{{n}}** | **{{n}}** | **{{n}}** | **{{mm:ss}}** |

**Pass rate:** {{passed / planned × 100}}%

### Result legend (ISTQB-aligned)

| Status | Meaning |
|--------|---------|
| **Passed** | Actual result matched expected result |
| **Failed** | Deviation from expected result; defect or environment issue under investigation |
| **Flaky** | Intermittent failure without a confirmed product change; quarantine candidate |
| **Blocked** | Could not execute (env, credentials, dependency) |
| **Skipped** | Intentionally not run in this trigger |

## 5. Failed / blocked tests

_If none, write “None.”_

| Test | Layer | Symptom | Likely cause | Severity | Owner | Linked defect |
|------|-------|---------|--------------|----------|-------|---------------|
| {{spec › title}} | UI/API | {{short}} | {{product \| test \| env \| data}} | {{Critical/High/Medium/Low}} | {{team}} | {{DEF-xxx / issue #n / new}} |

### Failure detail — {{TEST_NAME}} (repeat as needed)

- **Expected:** {{…}}
- **Actual:** {{…}}
- **Evidence:** screenshot `{{path}}` · trace `{{path}}` · log excerpt  
- **Impact:** {{user / revenue / compliance}}
- **Next action:** {{fix test \| open defect \| quarantine \| re-run after env fix}}
- **Due:** {{date}}

## 6. ADA / WCAG accessibility findings

Scans run at **390px (mobile)** and **1440px (desktop)** when UI a11y specs are in scope. Scope axe-core to the **component/section under test**, not the full page, unless explicitly agreed.

| Component / selector | Viewport | Critical | Serious | Moderate | Minor | Gate |
|----------------------|----------|----------|---------|----------|-------|------|
| {{e.g. #logInModal}} | 1440 | {{n}} | {{n}} | {{n}} | {{n}} | {{Block \| Observe}} |
| {{e.g. cart #tbodyid}} | 1440 | {{n}} | {{n}} | {{n}} | {{n}} | {{Block \| Observe}} |

**Policy**

- **Critical / serious** → block QA approval; must appear in the ticket / defect report.
- **Moderate / minor** → observations only; do not block unless product policy says otherwise.

**Applicable criteria (Shopify / storefront UI focus):** 1.4.3 Contrast, 2.1.1 Keyboard, 2.4.7 Focus Visible, 4.1.2 Name Role Value, 1.4.5 Images of Text, 2.5.5 Target Size, 2.5.3 Label in Name.

**ADA summary for Notion “QA Proof Of Functionality”:**  
{{1–3 sentences + link to DEF / issue if blockers exist.}}

## 7. Observations (non-blocking)

- {{env noise, public-demo flake, known DEF with accepted risk, performance note}}

## 8. New or updated defects

| ID | Title | Severity | Status | Link |
|----|-------|----------|--------|------|
| {{DEF-xxx}} | {{title}} | {{…}} | Open/Fixed | {{docs/defects/… or GitHub issue}} |

Defect reports use `docs/defects/` (severity, steps, expected/actual, evidence, impact, remediation).

## 9. Residual risk and recommendation

| Risk | Likelihood | Impact | Mitigation / follow-up |
|------|------------|--------|------------------------|
| {{…}} | L/M/H | L/M/H | {{…}} |

**Release recommendation:** {{Go \| No-Go \| Go with known risks}}  
**Rationale:** {{2–3 sentences}}  
**Override (if any):** {{CTO name · justification · follow-up ticket — SOC 2 record}}

## 10. Attachments checklist

- [ ] CI run URL
- [ ] Playwright HTML report
- [ ] Traces / screenshots for failures
- [ ] axe-core findings (or annotation in a11y specs)
- [ ] Defect links (`docs/defects/` + GitHub issues)
- [ ] This report filed under `docs/reports/` or Notion

---

## How to fill this after a run

```bash
# Local
npm run lint && npm run typecheck && npm run format:check
CI=1 npx playwright test
npx playwright show-report   # HTML report

# CI
# Copy Actions run URL, commit SHA, and download artifacts on failure
```

1. Copy this template → `docs/reports/{{date}}-{{trigger}}-{{sha}}.md` or Notion page.  
2. Fill sections 1–4 from CI / terminal output.  
3. For each failure, complete section 5 and open/link a defect if product-side.  
4. Complete section 6 whenever a11y specs ran.  
5. Set Go / No-Go in section 9 and send to the release channel / PR.
