# AI Usage Log

## Tools and agents used

- **Executor:** Kimi Code main agent (this conversation).
- **Technical Investigator:** Kimi Code subagent (planned for unknowns like API behavior or DOM selectors).
- **Independent Verifier:** Kimi Code subagent or human (planned for rubric checks).

## What was delegated to AI

- Repository inspection and cloning.
- Extraction of text from the challenge PDF.
- Design of agent roles, loop methodology, and context files (`VISION.md`, `ARCHITECTURE.md`, `RULES.md`, `MEMORY.md`).
- Drafting of this log.

## What was kept human

- Final approval of the plan and quality standards.
- Final ownership of strategic arguments, trade-offs, and scenarios.
- Decision on API target (RESTful Booker), package manager (npm), browsers (Chromium), headless mode, and verifier approach.
- Addition of SOC 2 Type II, ISTQB, and ADA/WCAG compliance as explicit constraints.
- Decision to create Demoblaze account with temporary email during setup.
- Decision to write final PDFs in Notion; AI provides Markdown drafts.
- Scope expanded to document found defects in `docs/defects/` as examples of QA defect reporting and triage.
- Code and documentation pushed to `https://github.com/Simonethg/db-QALead` with explicit user approval; `.env` was excluded from the commit.
- GitHub secrets `DEMOBLAZE_USERNAME` and `DEMOBLAZE_PASSWORD` added via `gh secret set` after user granted `gh` access.
- Defect reports published as GitHub issues #1 and #2 via `gh issue create`.
- CI workflow `QA Automation Suite` passed in GitHub Actions after secrets were configured (run 30414309392).

## Verification performed

- PDF text extracted with `pdftotext` and read manually.
- Repo inspected with `ls`, `git log`, `git branch`, and `Read`.
- Plan reviewed by human before approval.
- Initial test run revealed TypeScript module-resolution issues, missing `OrderDetails` type, UI tests not navigating to base URL, real Demoblaze accessibility violations, and a RESTful Booker endpoint returning 500 instead of 400. Each issue was diagnosed from command output and fixed iteratively.
- Final verification: `npm run lint`, `npm run typecheck`, `npm run format:check`, and `npm test` all pass. Six tests pass (2 API + 4 UI).
- Independent Verifier subagent reviewed the runnable project against `VISION.md`; its findings (package-lock.json ignored, traces not uploaded) were fixed by unignoring the lockfile and adding `test-results/` to CI artifact upload.

## Cases where AI output was corrected or incomplete

- Initial `FetchURL` to the Notion job posting returned only JavaScript shell; user provided the text directly.
- Initial `FetchURL` to the referenced X/Twitter post returned only the login page; user provided the article text directly.

## Principles not delegated

- Final judgment on strategy arguments and trade-offs remains human.
- No git mutations without explicit approval.
- No credential handling beyond `.env.example` templates.
