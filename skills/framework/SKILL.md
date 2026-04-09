---
name: framework
description: AWS SDK v2, S3 usage, streaming uploads, and runtime assumptions for the DataSync asset store.
---

# Framework & platform – Contentstack DataSync Asset Store (AWS S3)

## When to use

- You are changing S3 calls, regions, bucket policies, or upload streams
- You are upgrading or pinning `aws-sdk` (v2)
- You need to understand HTTP download (`request`) vs AWS client responsibilities

## Instructions

### AWS SDK

- Library uses **`aws-sdk`** v2 (not AWS SDK for JavaScript v3 modular clients)
- S3 client is constructed in [`src/setup.ts`](../../src/setup.ts) and injected into [`S3`](../../src/s3.ts)

### Streaming and HTTP

- Asset bytes are pulled via **`request`** and piped into S3 upload streams—be mindful of backpressure, errors on `response`, and connection close handling (see `download` in `s3.ts`)
- Changing HTTP client would be a cross-cutting decision (tests, typings, error semantics)

### Configuration

- Region, API version, bucket ACL, CORS, and credentials map to AWS S3 expectations documented in the main README—keep behavior aligned with [AWS S3 documentation](https://docs.aws.amazon.com/s3/)

### Node.js

- Target runtime is **Node >= 22** per `engines`; avoid APIs that require newer Node unless `engines` and docs are updated together

## References

- [`../datasync-asset-store-s3/SKILL.md`](../datasync-asset-store-s3/SKILL.md) — config and public API
- [AWS SDK for JavaScript v2 — S3](https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html)
