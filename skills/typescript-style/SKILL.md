---
name: typescript-style
description: TypeScript compiler settings, source layout, and conventions for src/ and typings/ in this repo.
---

# TypeScript – Contentstack DataSync Asset Store (AWS S3)

## When to use

- You are adding or editing `.ts` files under `src/`
- You need to match strictness (`noUnusedLocals`, `noImplicitReturns`, etc.) or output layout

## Instructions

### Layout

- **Source**: `src/**/*.ts` — compiled to `dist/` with **declaration** output to `typings/` (`tsconfig.json`)
- **Generated**: do not hand-edit `dist/` or committed typings if your workflow regenerates them; prefer `npm run build-ts` after changes
- **Tests**: live under `test/`, not under `src/` (see [`../testing/SKILL.md`](../testing/SKILL.md))

### Compiler

- **Module**: CommonJS; **target**: ES6; **strict** patterns via `alwaysStrict`, unused checks, `noFallthroughCasesInSwitch`
- **Interop**: `esModuleInterop` enabled for default imports (e.g. `debug`, `request`)
- **Libs**: `es2015` — avoid newer runtime APIs without polyfills or target updates

### Style

- TSLint is the configured linter (`tslint.json`); run `npm run tslint` before merge
- Prefer existing patterns: class `S3` with public methods, small `util/` helpers, `debug` namespaces per file

## References

- [`../datasync-asset-store-s3/SKILL.md`](../datasync-asset-store-s3/SKILL.md) — exported API surface
- [`../dev-workflow/SKILL.md`](../dev-workflow/SKILL.md) — build commands
