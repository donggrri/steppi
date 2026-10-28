# Provider survey (slice 1)

Updated: 2026-10-29 (verified local env)

**Wiring guide:** [PROVIDER_WIRE.md](PROVIDER_WIRE.md) · **Mock tests:** [provider-seam.md](provider-seam.md) · **Package JSON:** [settings.packages.example.json](settings.packages.example.json)

Selection rule for community packages: **highest GitHub stars** among viable Pi extensions that match intent, unless orchestration settles a donggrri fork (see below).

| steppi id | Decision | Package / source | Notes |
| --- | --- | --- | --- |
| **cursor** | **Reuse (donggrri)** | [`donggrri/pi-cursor-provider`](https://github.com/donggrri/pi-cursor-provider) | OAuth `/login cursor` + local gRPC proxy. Install: `pi install git:github.com/donggrri/pi-cursor-provider`. |
| **antigravity** | **Reuse (donggrri bridge)** | **`git:github.com/donggrri/pi-antigravity-bridge`** + **`agy` CLI** (headless) | **Primary path:** Pi git package + `agy` on `$PATH`. Install: `pi install git:github.com/donggrri/pi-antigravity-bridge`. Models use id prefix **`antigravity/`** (e.g. `antigravity/gemini-3-8-flash`). |
| **grok** | **Reuse (built-in + steppi extension)** | `@earendil-works/pi-ai` **`xai`**; product id **`grok`** via `packages/steppi` | Catalog models are **`xai/grok-4.3`** … **`xai/grok-4.7`** (same weights under product id **`grok`** when the steppi package is loaded). Auth: **`/login xai`** or **`XAI_API_KEY`**. **Not** Cursor-routed Grok—see [Grok vs Cursor](#grok-vs-cursor-routed-models) below. |

## Rejected / not primary (survey)

| Package | Why not primary |
| --- | --- |
| `npm:pi-cursor-sdk` | Competing `cursor` provider id; removed in favor of `pi-cursor-provider` OAuth path. |
| `npm:pi-antigravity` | Earlier survey option only; **not** the settled steppi path. Use **`git:github.com/donggrri/pi-antigravity-bridge`** + **`agy`**. |
| `@rahularya01/pi-cursor` | Fewer stars; not the settled OAuth package. |
| `open-gsd/gsd-pi` cursor-cli extension | Cursor CLI stream, not the settled provider path. |

## Agent home vs project config

| Scope | Path | Override |
| --- | --- | --- |
| **steppi product agent home** (credentials, sessions, global settings) | **`~/.steppi/agent`** | Set **`PI_CODING_AGENT_DIR=$HOME/.steppi/agent`** (recommended for steppi users). |
| **Plain Pi default** | `~/.pi/agent` | Default when `PI_CODING_AGENT_DIR` is unset. |
| **Project packages / trust** | **`.pi/`** under the working tree | Unchanged Pi default (e.g. `.pi/settings.json` for git packages + `./packages/steppi`). |

Both agent homes can coexist; steppi installs and `/login` state should target **`~/.steppi/agent`** when using this fork as the steppi product.

## Grok vs Cursor-routed models

- **steppi Grok** uses Pi built-in **xai** transport (product id **`grok`** via `packages/steppi`). Pick models like **`grok/grok-4.7`** or **`xai/grok-4.7`** with the steppi package loaded—not **`cursor/*`** ids.
- Models whose ids match **`cursor/*grok*`** are **Cursor OAuth / proxy routes**, not the steppi **grok** / **xai** provider. Using them for “Grok smoke” validates Cursor, not xAI.

## Wiring in this repo

1. Copy `.pi/settings.json.example` or [docs/settings.packages.example.json](settings.packages.example.json) → `.pi/settings.json` after project trust (gitignored).
2. **`packages/steppi`** (local package): registers **`grok`** and dashboard footer status (provider + turn/run) via Pi default TUI `setStatus`.
3. Git packages **cursor** and **antigravity** load from the `packages` list when install succeeds.
4. Stock Pi packages and CLI unchanged; no core forks for slice 1.

## Build / run from source (repo root)

```bash
npm install --ignore-scripts
npm run build
./pi-test.sh --help    # exit 0; runs Pi CLI from source via packages/coding-agent
```

For day-to-day steppi use, point agent storage at the product home (shell profile, wrapper script, or one-shot env):

```bash
export PI_CODING_AGENT_DIR="$HOME/.steppi/agent"
./pi-test.sh
```

Optional stock CLI checks (same build):

```bash
./packages/coding-agent/dist/cli.js --help
./packages/coding-agent/dist/cli.js --version
```

## Install / verify providers

```bash
# After build; with PI_CODING_AGENT_DIR set for steppi (see above)
pi install git:github.com/donggrri/pi-cursor-provider
pi install git:github.com/donggrri/pi-antigravity-bridge
npm run test --workspace=@earendil-works/pi-coding-agent -- steppi-slice1-providers
```

**Live smoke (optional):** needs OAuth / API keys, **`agy`** on `$PATH` for antigravity, and for Grok **`XAI_API_KEY`** or **`/login xai`**. Example:

```bash
PI_CODING_AGENT_DIR=$HOME/.steppi/agent ./pi-test.sh -p "Reply with exactly: OK" --model antigravity/gemini-3-8-flash
```

Record additional live runs in [SLICE.md](SLICE.md). CI uses mocked provider tests only.

## Intent match vs create

All three providers reuse existing packages or Pi built-in **`xai`**. **No new steppi-owned provider transport package** beyond thin **`packages/steppi`** (grok alias + TUI status).
