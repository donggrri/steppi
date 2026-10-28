# Provider survey (slice 1)

Updated: 2026-10-28 (Asia/Seoul)

**Wiring guide:** [PROVIDER_WIRE.md](PROVIDER_WIRE.md) · **Mock tests:** [provider-seam.md](provider-seam.md) · **Package JSON:** [settings.packages.example.json](settings.packages.example.json)

Selection rule for community packages: **highest GitHub stars** among viable Pi extensions that match intent, unless orchestration settles a donggrri fork (see below).

| steppi id | Decision | Package / source | Notes |
| --- | --- | --- | --- |
| **cursor** | **Reuse (donggrri)** | [`donggrri/pi-cursor-provider`](https://github.com/donggrri/pi-cursor-provider) | OAuth `/login cursor` + local gRPC proxy. Install: `pi install git:github.com/donggrri/pi-cursor-provider`. |
| **antigravity** | **Reuse (donggrri bridge)** | [`donggrri/pi-antigravity-bridge`](https://github.com/donggrri/pi-antigravity-bridge) + **`agy` CLI** (headless) | Requires `agy` on PATH. Install: `pi install git:github.com/donggrri/pi-antigravity-bridge`. |
| **grok** | **Reuse (built-in + steppi extension)** | `@earendil-works/pi-ai` **`xai`**; product id **`grok`** via `packages/steppi` | No `providerAliases` in Pi settings—see [PROVIDER_WIRE.md](PROVIDER_WIRE.md). `/login xai` or `XAI_API_KEY`; extension registers **`grok`** for selection and TUI labeling. |

## Rejected / not primary (survey)

| Package | Why not primary |
| --- | --- |
| `npm:pi-cursor-sdk` | Competing `cursor` provider id; removed in favor of `pi-cursor-provider` OAuth path. |
| `npm:pi-antigravity` | Superseded for steppi by `pi-antigravity-bridge` + `agy` (orchestration 2026-10-28). |
| `@rahularya01/pi-cursor` | Fewer stars; not the settled OAuth package. |
| `open-gsd/gsd-pi` cursor-cli extension | Cursor CLI stream, not the settled provider path. |

## Wiring in this repo

1. Copy `.pi/settings.json.example` or [docs/settings.packages.example.json](settings.packages.example.json) → `.pi/settings.json` after project trust (gitignored).
2. **`packages/steppi`** (local package): registers **`grok`** and dashboard footer status (provider + turn/run) via Pi default TUI `setStatus`.
3. Git packages **cursor** and **antigravity** load from the `packages` list when install succeeds.
4. Stock Pi packages and CLI unchanged; no core forks for slice 1.

## Install / verify (from repo root)

```bash
npm install
npm run build
./packages/coding-agent/dist/cli.js --help    # exit 0
./packages/coding-agent/dist/cli.js --version # exit 0
npm run test --workspace=@earendil-works/pi-coding-agent -- steppi-slice1-providers
```

Live `/login` + billed turns are optional; record smoke in [SLICE.md](SLICE.md). CI uses mocked provider tests only.

## Intent match vs create

All three providers reuse existing packages or Pi built-in **`xai`**. **No new steppi-owned provider transport package** beyond thin **`packages/steppi`** (grok alias + TUI status).
