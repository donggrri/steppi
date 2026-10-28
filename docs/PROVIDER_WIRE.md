# Steppi provider wiring (slice 1)

Design reference for wiring **cursor**, **antigravity**, and **grok** after the Pi fork. See also [PROVIDERS.md](PROVIDERS.md) (survey) and [provider-seam.md](provider-seam.md) (mock tests).

## Overview

| steppi id | Mechanism | Auth | Models | Prerequisite |
| --- | --- | --- | --- | --- |
| **cursor** | `git:github.com/donggrri/pi-cursor-provider` | `/login cursor` | `cursor/*` | Pi package install + project trust |
| **antigravity** | `git:github.com/donggrri/pi-antigravity-bridge` | Bridge + `agy` OAuth | `antigravity/*` | **`agy` on `$PATH`** (`which agy`) |
| **grok** | Pi built-in **xai** + steppi extension | `/login xai` or `XAI_API_KEY` | xAI catalog under product id **`grok`** | `packages/steppi` in project packages |

## Install

```bash
pi install git:github.com/donggrri/pi-cursor-provider
pi install git:github.com/donggrri/pi-antigravity-bridge
```

From a trusted steppi checkout, copy [settings.packages.example.json](settings.packages.example.json) to `.pi/settings.json` (gitignored) and add `"./packages/steppi"` so the grok product id and dashboard footer load locally.

## Grok → xai mapping (no `providerAliases`)

Pi **does not** define a `providerAliases` key in `settings.schema.json`. steppi documents the product mapping in this file and implements it in code:

- **`packages/steppi`** registers provider id **`grok`** by delegating to the built-in **xai** provider (same transport/auth as upstream).
- Users may still use **`xai`** directly; the steppi TUI footer displays **`xai` as `grok`** for product consistency.
- Prefer **`/login xai`** or **`XAI_API_KEY`** per upstream docs; **`/login grok`** uses the same xAI auth stack under the grok provider id.

## Error naming (SPEC)

Slice 1 requires errors to **name the provider** (`cursor`, `antigravity`, `grok`) and the missing piece (auth, binary, model)—not a separate rigid code enum. When surfacing failures:

- Include the provider id in user-visible text (e.g. auth check returns `provider: "grok"`).
- For antigravity, call out **`agy`** when the bridge cannot run the CLI.
- Do not depend on `PROVIDER_*_*` codes unless an upstream package already emits them.

## Configuration examples

- Minimal git packages only: [settings.packages.example.json](settings.packages.example.json)
- Full steppi project (includes local `packages/steppi`): `../.pi/settings.json.example` at repo root
