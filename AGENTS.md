# Contentstack DataSync Asset Store (AWS S3) – Agent guide

**Universal entry point** for contributors and AI agents. Detailed conventions live in **`skills/*/SKILL.md`**.

## What this repo is

| Field | Detail |
| --- | --- |
| **Name:** | [contentstack/datasync-asset-store-aws-s3](https://github.com/contentstack/datasync-asset-store-aws-s3) (npm: `contentstack-asset-store-aws-s3`; consumers often use `@contentstack/datasync-asset-store-aws-s3` per product docs) |
| **Purpose:** | TypeScript library that plugs into Contentstack DataSync to download assets from Contentstack and store them in Amazon S3 (publish/unpublish/delete flows). |
| **Out of scope (if any):** | Not a standalone HTTP server or full DataSync stack—use with [DataSync Manager](https://github.com/contentstack/datasync-manager), webhook listener, and a content store. No separate CLI beyond `example/`. |

## Tech stack (at a glance)

| Area | Details |
| --- | --- |
| Language | TypeScript (see `tsconfig.json`; `engines.node` >= 22) |
| Build | `npm run build-ts` — `tsc` outputs to `dist/`, declarations to `typings/` |
| Tests | Jest + ts-jest; tests under `test/**/*.ts` (`jest.config.js`) |
| Lint / coverage | TSLint (`tslint.json`, `npm run tslint`); Jest `--coverage` → `coverage/` (JSON + HTML) |
| Other | AWS SDK v2 (`aws-sdk`), `debug`, `lodash`; optional Husky pre-commit runs Talisman + Snyk (see `skills/dev-workflow/SKILL.md`) |

## Commands (quick reference)

| Command type | Command |
| --- | --- |
| Build | `npm run build-ts` |
| Test | `npm test` |
| Lint | `npm run tslint` |

CI / security: PR workflows under [`.github/workflows/`](.github/workflows/) — e.g. [SCA scan](.github/workflows/sca-scan.yml), [CodeQL](.github/workflows/codeql-analysis.yml), [policy scan](.github/workflows/policy-scan.yml), [Jira issues](.github/workflows/issues-jira.yml).

## Where the documentation lives: skills

| Skill | Path | What it covers |
| --- | --- | --- |
| Dev workflow | [`skills/dev-workflow/SKILL.md`](skills/dev-workflow/SKILL.md) | Branches, build/test/lint, Husky/Talisman/Snyk, CI pointers |
| Asset store API & DataSync | [`skills/datasync-asset-store-s3/SKILL.md`](skills/datasync-asset-store-s3/SKILL.md) | Public entry points, `S3` class, config, integration with DataSync Manager |
| TypeScript conventions | [`skills/typescript-style/SKILL.md`](skills/typescript-style/SKILL.md) | Layout, `tsconfig`, patterns matching this repo |
| Testing | [`skills/testing/SKILL.md`](skills/testing/SKILL.md) | Jest layout, mocks, coverage, credentials policy |
| Code review | [`skills/code-review/SKILL.md`](skills/code-review/SKILL.md) | PR checklist for this package |
| Framework & platform | [`skills/framework/SKILL.md`](skills/framework/SKILL.md) | AWS S3, `aws-sdk` v2, env/config boundaries |

An index with “when to use” hints is in [`skills/README.md`](skills/README.md).

## Using Cursor (optional)

If you use **Cursor**, [`.cursor/rules/README.md`](.cursor/rules/README.md) only points to **`AGENTS.md`**—same docs as everyone else.
