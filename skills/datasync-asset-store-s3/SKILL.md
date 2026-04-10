---
name: datasync-asset-store-s3
description: Public API, S3 asset store class, configuration, and DataSync Manager boundaries for the AWS S3 asset store package.
---

# Asset store API & DataSync – Contentstack DataSync Asset Store (AWS S3)

## When to use

- You are changing how assets are downloaded from Contentstack and stored in S3
- You are documenting or wiring `syncManager.setAssetStore(...)` for DataSync
- You need the canonical config shape (`assetStore` / credentials / bucket)

## Instructions

### Entry module

- **Package entry**: compiled `dist/` from [`src/index.ts`](../../src/index.ts) (`main` / `types` in `package.json`)
- **Primary exports**: `start`, `setConfig`, `getConfig`, `setLogger`, types `IConfig`, `ILogger`
- **`start(optionalConfig)`**: merges internal default config, validates `assetStore`, calls [`setup.init`](../../src/setup.ts), resolves an [`S3`](../../src/s3.ts) instance used by DataSync for publish/unpublish/delete flows

### S3 class (`src/s3.ts`)

- **`download(asset)`** — stream asset from Contentstack URL into S3 (published asset)
- **`unpublish(asset)`** / **`delete(assets: IAsset[])`** — remove or adjust objects per validations in [`src/util/validations.ts`](../../src/util/validations.ts)
- Uses **`request`** for HTTP download and **AWS SDK v2** S3 client passed in from setup

### Configuration

- Documented in the root [`README.md`](../../README.md): `pattern`, `region`, `apiVersion`, `credentials`, `bucketParams`, `uploadParams`, `CORSConfiguration`, `Policy`, etc.
- Validation errors and messages are centralized in [`src/util/messages.ts`](../../src/util/messages.ts)

### Integration boundary

- Intended use: `require('@contentstack/datasync-asset-store-aws-s3')` (or equivalent) with [DataSync Manager](https://github.com/contentstack/datasync-manager); do not assume this repo runs the webhook listener or content store

### Versioning

- Follow semver for npm releases; breaking changes to `start`’s resolved object or config contract need a major bump and README/changelog updates
