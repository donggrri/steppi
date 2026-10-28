# Provider seam mock tests (slice 1)

Maps design cases (TC-103 … TC-110) to **automated** coverage in CI. Live git package installs and `agy` on PATH are out of scope for CI.

| Case | Intent | Automated coverage |
| --- | --- | --- |
| TC-103 | `cursor` package registers `cursor/*` models | `steppi-slice1-providers.test.ts` — faux `cursor` provider selectable after registration (git install mocked via extension register) |
| TC-104 | Cursor auth failure names **cursor** | Same file — `auth check --provider cursor` → `not_ready`, `provider: "cursor"` |
| TC-105 | Antigravity bridge when `agy` present | Manual / live smoke in [SLICE.md](SLICE.md); bridge package not loaded in CI |
| TC-106 | Missing **antigravity** / config | `auth check --provider antigravity` → `not_ready`, `provider: "antigravity"` |
| TC-107 | Product **grok** id maps to xAI transport | `getModel("grok", "grok-4.7")` with `provider: "grok"` via `packages/steppi` |
| TC-108 | xAI auth via env when no stored login | Manual; upstream `xai` auth. Grok id shares xAI auth in extension |
| TC-109 | Stream disconnect | Deferred (upstream provider behavior); not slice 1 gate |
| TC-110 | Invalid package does not kill agent | Manual: Pi skips failed packages at startup (see [packages.md](../packages/coding-agent/docs/packages.md)) |

Run:

```bash
npm run test --workspace=@earendil-works/pi-coding-agent -- steppi-slice1-providers
```

Design drafts must not require `PROVIDER_*_*` error codes unless Pi or the provider package already uses them.
