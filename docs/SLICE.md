# Slice 1 verification log

Updated: 2026-10-29 (local env docs); slice verification 2026-10-28 Asia/Seoul

## Scope delivered

- Upstream [earendil-works/pi](https://github.com/earendil-works/pi) at commit in `docs/UPSTREAM.md`
- Product docs from prep tarball under `docs/`, `GLOSSARY.md`, `skills-lock.json`, `.atomic-workflow.json`
- Provider wiring: `.pi/settings.json.example` + `packages/steppi` (see [PROVIDER_WIRE.md](PROVIDER_WIRE.md))
- Mocked tests: `packages/coding-agent/test/steppi-slice1-providers.test.ts` (see [provider-seam.md](provider-seam.md))

## Stage A — stock Pi CLI (TC-101)

Recorded **2026-10-28 21:42 Asia/Seoul** on cloud agent VM after `npm install --ignore-scripts && npm run build`:

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

Recorded **2026-10-28 21:52 Asia/Seoul** after push `399057224`:

| Workflow | Result |
| --- | --- |
| **CI** (`build-check`, `test` coding-agent/durable/other, `mcp-conformance`) | **SUCCESS** |
| **Publish Model Catalog / generate** | **SUCCESS** (after fetching lightweight release tags from `earendil-works/pi` in workflow) |
| **Publish Model Catalog / publish** | Skipped on PR (expected) |

Fix: `.github/workflows/publish-model-catalog.yml` force-fetches upstream tags and validates `vX.Y.Z^{commit}` (upstream uses lightweight release tags).

## Stage D — dashboard TUI (FR-114/115, manual)

Product UI is **Pi default agent TUI**. steppi adds footer status via `ctx.ui.setStatus("steppi", …)` showing:

- Selected provider (`cursor`, `antigravity`, or `grok`; legacy `xai` displayed as `grok`)
- Run state (`running` / `idle`) and turn counter

Headless CI does not drive the TUI; extension hooks + manual smoke when OAuth/`agy` available.

## Live provider smoke (optional)

Not required for slice 1 CI. Use **`PI_CODING_AGENT_DIR=$HOME/.steppi/agent`** so installs and `/login` match the steppi product home (see [PROVIDERS.md](PROVIDERS.md)). Requires OAuth/API keys, **`agy` on PATH** for antigravity, and for Grok **`XAI_API_KEY`** or **`/login xai`** (not **`cursor/*grok*`** models).

Example antigravity print-mode smoke (from repo root after build):

```bash
PI_CODING_AGENT_DIR=$HOME/.steppi/agent ./pi-test.sh -p "Reply with exactly: OK" --model antigravity/gemini-3-8-flash
```

| Provider | Status |
| --- | --- |
| cursor | Deferred without OAuth in CI |
| antigravity | Deferred without `agy` + token in CI; primary package **`git:github.com/donggrri/pi-antigravity-bridge`** |
| grok | Mocked: `auth check --provider grok` → `not_ready` without credentials; live uses **`xai/grok-4.*`** / **`grok/*`**, not Cursor-routed **`cursor/*grok*`** |

## Blockers / follow-ups

- Git provider packages need network + project trust on first run; Pi skips failed packages at startup.
- Antigravity bridge requires **`agy` CLI** installed separately.
- Live `/login` smoke: optional; record in this file when run on a trusted desktop.
