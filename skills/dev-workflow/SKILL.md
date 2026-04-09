---
name: dev-workflow
description: Branches, local commands, Husky pre-commit (Talisman/Snyk), and GitHub Actions for this DataSync AWS S3 asset store repo.
---

# Development workflow – Contentstack DataSync Asset Store (AWS S3)

## When to use

- You are cloning the repo, installing dependencies, or running build/test/lint locally
- You need to know what runs on commit or in CI
- You are aligning branch/PR practice with the rest of Contentstack DataSync modules

## Instructions

### Prerequisites

- **Node.js** >= 22 (`package.json` `engines`)
- **npm** for install and scripts
- For **commits** (if Husky hook is active): [Talisman](https://thoughtworks.github.io/talisman/) and [Snyk CLI](https://snyk.io/) installed locally, or set `SKIP_HOOK=1` only when policy allows (see `.husky/pre-commit`)

### Common commands

- Install: `npm install`
- Clean + compile: `npm run build-ts` (outputs `dist/`, declarations in `typings/`)
- Watch compile: `npm run watch-ts`
- Tests with coverage: `npm test`
- Lint (TSLint): `npm run tslint`
- Husky setup (maintainers): `npm run pre-commit` (installs Husky and prepares hook)

### CI / automation

- Pull requests trigger workflows in `.github/workflows/`, including SCA (Snyk), CodeQL, and policy scans—see filenames for scope
- No dedicated “unit test only” workflow in-repo; rely on `npm test` locally before push

### Branches and PRs

- Use feature branches; target the repo’s default branch per team process (not hard-coded here)
- Keep changes scoped; this package is consumed by DataSync Manager—avoid breaking the exported `start` / asset store contract without coordination

## References

- [`../datasync-asset-store-s3/SKILL.md`](../datasync-asset-store-s3/SKILL.md) — public API and integration
- [`../testing/SKILL.md`](../testing/SKILL.md) — Jest and coverage
- [DataSync Manager](https://github.com/contentstack/datasync-manager) — consumer integration
