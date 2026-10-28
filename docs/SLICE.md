# Slice 1 verification log

Updated: 2026-10-28 (Asia/Seoul)

## Scope delivered

- Upstream [earendil-works/pi](https://github.com/earendil-works/pi) at commit in `docs/UPSTREAM.md`
- Product docs from prep tarball under `docs/`, `GLOSSARY.md`, `skills-lock.json`, `.atomic-workflow.json`
- Provider wiring: `.pi/settings.json` + `packages/steppi`
- Mocked tests: `packages/coding-agent/test/steppi-slice1-providers.test.ts` (see [provider-seam.md](provider-seam.md))

## Commands (record results after run)

| Check | Command | Expected |
| --- | --- | --- |
| TC-101 stock CLI | `./packages/coding-agent/dist/cli.js --help` | exit 0 |
| TC-101 version | `./packages/coding-agent/dist/cli.js --version` | exit 0 |
| TC-110/112 providers | `npm run test --workspace=@earendil-works/pi-coding-agent -- steppi-slice1-providers` | pass (4 tests, 2026-10-28) |
| TC-114 TUI | Interactive `./packages/coding-agent/dist/cli.js` in trusted project; footer shows `steppi` status key | provider + run/turn (manual) |

## Dashboard TUI (FR-114/115)

Product UI is **Pi default agent TUI**. steppi adds footer status via `ctx.ui.setStatus("steppi", …)` showing:

- Selected provider (`cursor`, `antigravity`, or `grok`; legacy `xai` displayed as `grok`)
- Run state (`running` / `idle`) and turn counter

Headless CI does not drive the TUI; behavior is covered by extension hooks and manual smoke above.

## Live provider smoke

Optional; not required for CI. Requires OAuth/API keys and (for antigravity) `agy` on PATH.

| Provider | Status |
| --- | --- |
| cursor | Deferred without OAuth in CI |
| antigravity | Deferred without `agy` + token in CI |
| grok | `auth check --provider grok` → `not_ready` without credentials (mocked test) |

## Blockers

- Git provider packages (`pi-cursor-provider`, `pi-antigravity-bridge`) need network + project trust on first run; failures are non-fatal at startup (Pi skips broken packages).
- Antigravity bridge requires **`agy` CLI** installed separately.
