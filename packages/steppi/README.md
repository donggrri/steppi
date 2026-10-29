# @donggrri/steppi

Pi package for the steppi product: **grok** provider alias, footer dashboard status, and **automatic per-model system-prompt addenda**.

Load via project `.pi/settings.json` (`"./packages/steppi"`) or `pi install`.

## Per-model prompt profiles

When the steppi extension is loaded, Pi’s `before_agent_start` hook appends a short tagged section (`steppi_model_guidance`) based on the active model. Unmatched models get **no** extra section (neutral fallback).

| Profile | When it applies | Edit addendum in |
|--------|------------------|-------------------|
| **grok** | Provider `grok` or `xai`; Cursor models whose id contains `grok` (e.g. `cursor/grok-4.7`) | `prompts/grok-addendum.ts` |
| **composer** | Cursor `composer-2`, `composer-2.5`, or ids starting with `composer-2` | `prompts/composer-addendum.ts` |
| **flash** | Antigravity models whose id contains both `gemini` and `flash` | `prompts/gemini-flash-addendum.ts` |
| **neutral** | Everything else | (no section) |

Mapping logic lives in `model-prompt-profile.ts` (`resolveModelPromptProfile`). The footer status line includes the profile name (`grok`, `composer`, `flash`) when not neutral.

Provider wiring and auth: repo root [docs/PROVIDER_WIRE.md](../../docs/PROVIDER_WIRE.md).

## Pitfalls

For antigravity headless runs, ensure **`agy`** is on `PATH` or set **`AGY_BINARY`** (e.g. `$HOME/.local/bin/agy`).

## Tests

Profile resolution and prompt injection are covered in `packages/coding-agent/test/steppi-slice1-providers.test.ts` and `steppi-model-prompt-profiles.test.ts` (no live API).
