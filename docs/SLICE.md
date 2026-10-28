# Slice 1 verification log

Updated: 2026-10-28 21:42 Asia/Seoul (agent VM wrap-up)

## Scope delivered

- Upstream [earendil-works/pi](https://github.com/earendil-works/pi) at commit in `docs/UPSTREAM.md`
- Product docs from prep tarball under `docs/`, `GLOSSARY.md`, `skills-lock.json`, `.atomic-workflow.json`
- Provider wiring: `.pi/settings.json.example` + `packages/steppi` (see [PROVIDER_WIRE.md](PROVIDER_WIRE.md))
- Mocked tests: `packages/coding-agent/test/steppi-slice1-providers.test.ts` (see [provider-seam.md](provider-seam.md))

## Stage A — stock Pi CLI (TC-101)

Recorded **2026-10-28 21:42 Asia/Seoul** on cloud agent VM after `npm run build`:

| Check | Command | Result |
| --- | --- | --- |
| TC-101 help | `./packages/coding-agent/dist/cli.js --help` | **exit 0** |
| TC-101 version | `./packages/coding-agent/dist/cli.js --version` | **exit 0**, stdout **`1.4.0`** |

## Stage B — mocked provider seam (TC-103..110 / FR-110)

Recorded **2026-10-28 21:42 Asia/Seoul**:

```bash
npm run test --workspace=@earendil-works/pi-coding-agent -- steppi-slice1-providers
```

| Result | Detail |
| --- | --- |
| **PASS** | 1 file, **6 tests** passed (Vitest 4.1.12) |

Covers: grok product id registration, cursor/antigravity routing when registered, auth `not_ready` naming **cursor** / **antigravity** / **grok**, tri-provider model lookup.

## Stage C — CI (PR #2)

| Workflow | Notes |
| --- | --- |
| **CI** | `build-check` + `test (coding-agent|durable|other)` — required for slice 1 |
| **Publish Model Catalog** | Failed on fork without tag `v1.4.0`; fixed by fetching release tags from `earendil-works/pi` in `.github/workflows/publish-model-catalog.yml` before `check:model-catalog-compat` |

Re-check Actions on [PR #2](https://github.com/donggrri/steppi/pull/2) after push; Grok Bot merges when green.

## Stage D — dashboard TUI (FR-114/115, manual)

Product UI is **Pi default agent TUI**. steppi adds footer status via `ctx.ui.setStatus("steppi", …)` showing:

- Selected provider (`cursor`, `antigravity`, or `grok`; legacy `xai` displayed as `grok`)
- Run state (`running` / `idle`) and turn counter

Headless CI does not drive the TUI; extension hooks + manual smoke when OAuth/`agy` available.

## Live provider smoke (optional)

Not required for slice 1 CI. Requires OAuth/API keys and (for antigravity) **`agy` on PATH**.

| Provider | Status |
| --- | --- |
| cursor | Deferred without OAuth in CI |
| antigravity | Deferred without `agy` + token in CI |
| grok | Mocked: `auth check --provider grok` → `not_ready` without credentials |

## Blockers / follow-ups

- Git provider packages need network + project trust on first run; Pi skips failed packages at startup.
- Antigravity bridge requires **`agy` CLI** installed separately.
- Live `/login` smoke: optional; record in this file when run on a trusted desktop.
