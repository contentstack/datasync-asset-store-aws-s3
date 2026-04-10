---
name: code-review
description: PR expectations and review checklist for the DataSync AWS S3 asset store TypeScript package.
---

# Code review – Contentstack DataSync Asset Store (AWS S3)

## When to use

- You are opening or reviewing a pull request that touches this repository
- You need a quick quality bar aligned with a small npm library and DataSync consumers

## Instructions

### Before approving

- **Build**: `npm run build-ts` succeeds; `dist/` / `typings/` changes are intentional if committed
- **Tests**: `npm test` passes; new behavior has tests or a clear reason if not testable
- **Lint**: `npm run tslint` passes for touched files
- **API contract**: changes to `start`, `setConfig`, or `S3` public methods are backward compatible or version/docs updated
- **Security**: no secrets in code; Talisman/Snyk expectations respected for teams using Husky hooks
- **Docs**: user-visible config or behavior changes reflected in root `README.md` when appropriate

### Severity (optional)

- **Blocker**: broken build, failing tests, secret leak, or breaking change without semver/docs
- **Major**: missing tests for non-trivial logic, unclear error handling for S3/network failures
- **Minor**: naming, comment updates, small refactors for readability
