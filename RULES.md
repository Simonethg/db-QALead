# RULES.md — Agent Operating Rules

## Human authority

- The human is the Product Owner and final judge.
- Any scope cut, tool change, or architectural decision is approved by the human before implementation.
- The human owns the final arguments in the strategy document and scenarios.

## Credentials and secrets

- Never commit credentials, tokens, passwords, or private keys.
- Credentials are injected through environment variables.
- Provide a `.env.example` file with empty or placeholder values.

## Git discipline

- Do not run `git commit`, `git push`, `git reset`, `git rebase`, or any destructive git mutation
  without explicit human approval.
- It is fine to check `git status`, `git diff`, and read git history.

## Environment boundaries

- Work only inside `/Users/macbook/projects/dualboot-TechnicalChallenge/db-QALead`.
- Do not modify files outside this directory.
- Do not install global dependencies; keep all tools inside the project.

## Verification before claims

- Do not state a fact without evidence (command output, file content, official documentation).
- If uncertain, ask the human or use the Technical Investigator subagent.

## Memory protocol

- Read `MEMORY.md` before starting work on a new deliverable.
- Update `MEMORY.md` before finishing a deliverable.
- Update `AI_USAGE_LOG.md` whenever AI is used to produce or modify a deliverable.

## Quality gates

- Code changes are verified by running lint, type check, and the relevant tests.
- Documentation is verified against page limits and required sections.
- No deliverable is marked complete until it passes its verification step.

## Loop discipline

- Work in small, verifiable steps.
- If a step fails verification, feed the failure back into the next iteration.
- Prefer closed loops with clear exit criteria over open-ended exploration.
