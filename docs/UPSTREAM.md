# Upstream Pi baseline

2026-10-28 c3d8ce44d3231c7e46071d2d859f41ca7d39d21b c3d8ce4

## Provider registration (steppi slice 1)

- **Built-in LLM providers** register in `@earendil-works/pi-ai` (`packages/ai/src/providers/all.ts`) and surface through `ModelRegistry` / `ModelRuntime`.
- **Extension providers** register via `pi.registerProvider()` from package extensions (`packages/coding-agent/src/core/extensions/types.ts`). Project packages load from `.pi/settings.json` after trust; personal packages from `~/.pi/agent/settings.json`.
- **steppi wiring** lives in `packages/steppi` (local project package) plus git packages `donggrri/pi-cursor-provider` and `donggrri/pi-antigravity-bridge` declared in `.pi/settings.json`.
- **Product id `grok`** maps to Pi **`xai`** semantics via the steppi extension (`packages/steppi/extensions/index.ts`), which registers provider id `grok` using xAI transport and auth.
- **Dashboard status (FR-114/115)** uses Pi default agent TUI footer hooks: `packages/steppi/extensions/index.ts` calls `ctx.ui.setStatus()` on `model_select`, `turn_start`, and `turn_end` (same pattern as `packages/coding-agent/examples/extensions/status-line.ts` and `model-status.ts`).
