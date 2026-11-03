# Steppi provider wiring (slice 1)

Design reference for wiring **cursor**, **antigravity**, and **grok** after the Pi fork. See also [PROVIDERS.md](PROVIDERS.md) (survey) and [provider-seam.md](provider-seam.md) (mock tests).

## Overview

| steppi id | Mechanism | Auth | Models | Prerequisite |
| --- | --- | --- | --- | --- |
| **cursor** | `git:github.com/donggrri/pi-cursor-provider` | `/login cursor` | `cursor/*` | Pi package install + project trust |
| **antigravity** | `git:github.com/donggrri/pi-antigravity-bridge` | Bridge + `agy` OAuth | `antigravity/*` | **`agy` on `$PATH`** (`which agy`) |
| **grok** | Pi built-in **xai** + steppi extension | `/login xai` or `XAI_API_KEY` | **`xai/grok-4.3`** … **`xai/grok-4.7`** (product id **`grok`** when steppi package loads) | `packages/steppi` in project packages |

**Antigravity primary install:** `git:github.com/donggrri/pi-antigravity-bridge` (not npm `pi-antigravity`; see [PROVIDERS.md](PROVIDERS.md)).

## Agent directory

| Use | Path |
| --- | --- |
| steppi product (recommended) | **`~/.steppi/agent`** via **`PI_CODING_AGENT_DIR=$HOME/.steppi/agent`** |
| upstream Pi default | `~/.pi/agent` |

Project-level packages and trust still live under **`.pi/`** in the repo working tree. Run **`pi install`** (and `./pi-test.sh`) with the same **`PI_CODING_AGENT_DIR`** you use for `/login` so git packages and credentials land in the steppi home.

## Install

```bash
export PI_CODING_AGENT_DIR="${PI_CODING_AGENT_DIR:-$HOME/.steppi/agent}"
pi install git:github.com/donggrri/pi-cursor-provider
pi install git:github.com/donggrri/pi-antigravity-bridge
```

From a trusted steppi checkout, copy [settings.packages.example.json](settings.packages.example.json) to `.pi/settings.json` (gitignored) and add `"./packages/steppi"` so the grok product id and dashboard footer load locally.

Build from source before first run: `npm install --ignore-scripts && npm run build`, then `./pi-test.sh` (or a local **`steppi`** wrapper that exports **`PI_CODING_AGENT_DIR`**).

## Grok → xai mapping (no `providerAliases`)

Pi **does not** define a `providerAliases` key in `settings.schema.json`. steppi documents the product mapping in this file and implements it in code:

- **`packages/steppi`** registers provider id **`grok`** by delegating to the built-in **xai** provider (same transport/auth as upstream).
- Users may still use **`xai`** directly; the steppi TUI footer displays **`xai` as `grok`** for product consistency.
- Prefer **`/login xai`** or **`XAI_API_KEY`** per upstream docs; **`/login grok`** uses the same xAI auth stack under the grok provider id.
- **Do not confuse with Cursor:** model ids like **`cursor/*grok*`** are Cursor-routed models from **`pi-cursor-provider`**, not steppi **grok** / **xai**. Live Grok smoke requires **`XAI_API_KEY`** or **`/login xai`**, and a **`grok/*`** or **`xai/grok-*`** model—not **`cursor/*grok*`**.

- **Do not confuse with Cursor:** model ids like **`cursor/*grok*`** are Cursor-routed models from **`pi-cursor-provider`**, not steppi **grok** / **xai**. Live Grok smoke requires **`XAI_API_KEY`** or **`/login xai`**, and a **`grok/*`** or **`xai/grok-*`** model—not **`cursor/*grok*`.

## Per-model system prompt profiles

With **`packages/steppi`** loaded, the extension appends a short **`steppi_model_guidance`** section on each agent run based on the selected model (neutral fallback when unmatched). Footer status shows **`grok`**, **`composer`**, or **`flash`** when a profile is active.

| Profile | Match |
| --- | --- |
| Grok | `grok/*`, `xai/*`; `cursor/*` ids containing `grok` |
| Composer | `cursor/composer-2`, `cursor/composer-2.5`, other `composer-2*` cursor ids |
| Flash | `antigravity/*` ids containing both `gemini` and `flash` |

Edit addendum text under **`packages/steppi/prompts/`**; mapping logic in **`packages/steppi/model-prompt-profile.ts`**. See **`packages/steppi/README.md`**.

## Error naming (SPEC)

Slice 1 requires errors to **name the provider** (`cursor`, `antigravity`, `grok`) and the missing piece (auth, binary, model)—not a separate rigid code enum. When surfacing failures:

- Include the provider id in user-visible text (e.g. auth check returns `provider: "grok"`).
- For antigravity, call out **`agy`** when the bridge cannot run the CLI.
- Do not depend on `PROVIDER_*_*` codes unless an upstream package already emits them.

## Configuration examples

- Minimal git packages only: [settings.packages.example.json](settings.packages.example.json)
- Full steppi project (includes local `packages/steppi`): `../.pi/settings.json.example` at repo root
