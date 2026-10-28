# Provider survey (slice 1)

Updated: 2026-10-28 (Asia/Seoul)

Selection rule for community packages: **highest GitHub stars** among viable Pi extensions that match intent, unless orchestration settles a donggrri fork (see below).

| steppi id | Decision | Package / source | Notes |
| --- | --- | --- | --- |
| **cursor** | **Reuse (donggrri)** | [`donggrri/pi-cursor-provider`](https://github.com/donggrri/pi-cursor-provider) | OAuth `/login cursor` + local gRPC proxy. Install: `pi install git:github.com/donggrri/pi-cursor-provider`. Declared in repo `.pi/settings.json`. SPEC “Cursor SDK” is satisfied for slice 1 by this OAuth provider path (orchestration 2026-10-28). |
| **antigravity** | **Reuse (donggrri bridge)** | [`donggrri/pi-antigravity-bridge`](https://github.com/donggrri/pi-antigravity-bridge) + **`agy` CLI** (headless) | Replaces `npm:pi-antigravity` for this product pass. Install: `pi install git:github.com/donggrri/pi-antigravity-bridge`. Requires `agy` on PATH and Antigravity OAuth under `~/.gemini/antigravity-cli/`. |
| **grok** | **Reuse (built-in + steppi alias)** | `@earendil-works/pi-ai` provider **`xai`**, product id **`grok`** via `packages/steppi` | `/login grok` or `/login xai` use xAI auth. steppi registers provider id **`grok`** that delegates to xAI transport (see `packages/steppi/extensions/index.ts`). |

## Rejected / not primary (survey)

| Package | Why not primary |
| --- | --- |
| `npm:pi-cursor-sdk` | Competing `cursor` provider id; removed in favor of `pi-cursor-provider` OAuth path. |
| `npm:pi-antigravity` | Superseded for steppi by `pi-antigravity-bridge` + `agy` (orchestration 2026-10-28). |
| `@rahularya01/pi-cursor` | Fewer stars; not the settled OAuth package. |
| `open-gsd/gsd-pi` cursor-cli extension | Cursor CLI stream, not the settled provider path. |

## Wiring in this repo

1. **Project packages** (after trust): copy `.pi/settings.json.example` to `.pi/settings.json` (see `docs/PROVIDERS.md`).
2. **steppi package** (`packages/steppi`): registers **`grok`** and dashboard footer status (provider + turn/run) via Pi default TUI `setStatus`.
3. **Project package list**: copy `.pi/settings.json.example` → `.pi/settings.json` (gitignored) after granting project trust, or install packages manually per table above.
4. **Stock Pi** packages and CLI remain unchanged; no core forks for slice 1.

## Install / verify (from repo root)

```bash
npm install
npm run build
./packages/coding-agent/dist/cli.js --help    # exit 0
./packages/coding-agent/dist/cli.js --version # exit 0
npm run test --workspace=@earendil-works/pi-coding-agent -- steppi-slice1-providers
```

Live `/login` + billed turns are optional; record smoke in `docs/SLICE.md`. CI uses mocked provider tests only.

## Intent match vs create

All three providers reuse existing packages or Pi built-in **`xai`**. **No new steppi-owned provider transport package** was required beyond thin **`packages/steppi`** wiring (grok alias + TUI status).
