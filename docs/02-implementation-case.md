# Implementation Case

## Objective

Implement the TODOs in `src/candidate/catalog-sync-use-case.ts`:

1. `planDiff(previous, incoming)`
2. `persistDiff(input)`
3. `execute(job)`

## Guidance

Treat this as a small production-like backend task. Focus on correctness first, then code quality.

Questions to keep in mind while implementing:

- How should `planDiff` identify changes in a way that is reliable and predictable? (`diff`, `equality`, `ordering`)
- How should `persistDiff` behave if one write fails in the middle? (`transaction`, `atomicity`, `rollback`)
- How should `execute` behave if the same trigger is replayed, or if another sync is already running? (`idempotency`, `lock`, `concurrent`)

## Rules

- Keep method signatures unchanged
- Do not modify tests
- Keep implementation readable and explainable

## Command

```bash
npm test
```
