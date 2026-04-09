---
name: testing
description: Jest + ts-jest setup, test file locations, coverage, and safe handling of AWS or Contentstack credentials in tests.
---

# Testing – Contentstack DataSync Asset Store (AWS S3)

## When to use

- You are adding or fixing tests under `test/`
- You need coverage settings or to mock HTTP/S3
- You are deciding whether to commit secrets or real endpoints in tests

## Instructions

### Runner and config

- **Command**: `npm test` — runs Jest with `--coverage --verbose` per `package.json`
- **Config**: [`jest.config.js`](../../jest.config.js) — `ts-jest`, Node environment, `testMatch` includes `test/**/*.ts`
- **Ignored paths**: e.g. `test/assets/*`, `test/config.ts` in `testPathIgnorePatterns` — respect these when adding files

### Layout

- Tests colocated under [`test/`](../../test/) (e.g. `download.ts`, `delete.ts`, `unpublish.ts`, `config.ts`, `validations.ts`)
- Use existing helpers in [`test/util.ts`](../../test/util.ts) where applicable

### Mocking

- **HTTP**: project uses **nock** in devDependencies — prefer nock over live URLs for download/stream tests
- **AWS**: mock S3 client behavior rather than requiring real buckets unless you have an isolated integration environment

### Credentials policy

- **Never** commit AWS keys, Contentstack tokens, or real stack URLs in tests or fixtures
- Use env vars or local-only config files that are gitignored for true integration runs

### Coverage

- Reports: `coverage/` (JSON + HTML per Jest config); ensure new code paths are covered when fixing bugs or adding behavior

## References

- [`../dev-workflow/SKILL.md`](../dev-workflow/SKILL.md) — `npm test` in local workflow
- [`../framework/SKILL.md`](../framework/SKILL.md) — AWS S3 behavior under test
