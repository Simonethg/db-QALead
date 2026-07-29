# Written Scenarios

## Scenario 1 — The environment you do not control

**Context.** Two weeks into the role, the nightly automated run starts failing. Root cause: a sales engineer reset a tenant's plan and usage data the previous evening to prepare a customer demo on the shared staging environment. The DevOps engineer says a dedicated QA environment is roughly six months of work and not budgeted this year. The CTO wants the nightly run to be trustworthy by the end of the month.

**What I do in the next two weeks.**

First, I make the test suite resilient to a shared environment. Every test will create its own tenant, user, and data at the start and clean it up at the end. No test will assume a pre-existing tenant state. For tests that must verify the nightly billing job, I add a lightweight hook that lets an authorized test user trigger the job for a single tenant, so the run does not depend on the global schedule or the state left by others.

Second, I change the nightly run timing. I move it to the quietest window for demos — typically early morning UTC — and publish a calendar that engineering and sales can see. I also add a small environment-health check at the beginning of the run; if it detects a reset or missing seed data, it fails fast with a clear message instead of producing a cascade of confusing failures.

Third, I protect the data that matters most. I ask the DevOps engineer for a read-only snapshot or a "do not touch" tenant flag for the account the nightly run uses. This is not a full QA environment; it is a lightweight guardrail.

**What I ask for, and from whom.**

- From the **CTO**: approval to add testability hooks gated by environment variables and a temporary policy that sales engineers notify QA before resetting shared staging data.
- From the **DevOps engineer**: the read-only snapshot or tenant flag, plus logs from the staging database so I can verify test isolation.
- From the **sales engineer**: a 24-hour heads-up before demos that involve data resets, and access to a demo script I can use to make tests expect those resets.
- From **engineering**: a `/test/seed-tenant` endpoint and a single-tenant billing trigger, scoped to staging only.

The six-month QA environment stays on the roadmap, but the nightly run becomes trustworthy within two weeks by combining isolation, timing, communication, and lightweight guardrails.

## Scenario 2 — Testability and a senior engineer

**Context.** On a new invoice-export feature, I point out that there is no reliable way to test it: the export can only be triggered by the nightly billing job, the resulting table has no stable selectors, and there is no way to seed a tenant into the state the export requires. A senior engineer replies that adding hooks "for QA" pollutes production code, that the export is already covered by unit tests, and that I should test it through the UI like a real user would. The CTO is following the thread.

**How I respond.**

I reply in the PR thread, addressing the senior engineer and the CTO together.

> I agree the export logic itself is well covered by unit tests, and I do not want to weaken that. The gap I see is not in the algorithm; it is in the integration path that a real tenant experiences. Right now we cannot verify end-to-end that the export file is generated with the correct data, lands in the UI, and can be downloaded. That is the path where our last invoice defect escaped.
>
> The hooks I am asking for are not "for QA" in the sense of test-only scaffolding. They are observable, controllable interfaces that make the system more maintainable for everyone: an admin endpoint to trigger the billing job for one tenant, stable selectors on the export table, and a seed endpoint to put a tenant into the required state. These are standard production engineering practices, not QA special cases.
>
> Testing only through the UI without these interfaces would mean our automated suite runs at the mercy of the global billing schedule and brittle CSS paths. That makes the test slow, flaky, and unable to tell us whether a failure is in the export or in the surrounding UI. I would rather have a fast, reliable integration test that uses the same production code paths.

**What I actually ask for.**

1. A `POST /admin/billing/run-for-tenant/{tenantId}` endpoint, gated to admin users and disabled in production by default, so the billing job can be triggered deterministically.
2. `data-testid` attributes on the export table rows and download button.
3. A `POST /test/seed-tenant` endpoint in staging that creates a tenant with the exact plan, usage, and billing state needed for the export test.

I also offer to pair with the senior engineer to implement the first hook so he can review the exact change and confirm it does not affect production behavior. If the team still objects, I propose a time-boxed experiment: add the hooks for two weeks, run the integration test, and review the flakiness and coverage data before deciding whether to keep them.
