# ADR-0001: Slice 1 ships three providers; UI is TUI; CLI stays `pi`

## Status

Accepted (2026-10-28, Asia/Seoul)

## Context

steppi needs a clear first-slice boundary for providers, UI, and CLI naming before Execute.

## Decision

1. Slice 1 **Must** ship **cursor**, **antigravity**, and **grok** together (not cursor-only then follow-ups).
2. Product UI is **dashboard TUI only**; web is out of early slices.
3. Prefer **extending Pi's agent TUI**; create a steppi TUI package only on intent mismatch.
4. Grok **login entry** lives in the dashboard TUI; reuse matching auth modules under the hood when available.
5. Keep the upstream **`pi` CLI entry** for now; do not add a `steppi` binary rename in slice 1.

## Consequences

- FR-108 (provider switch) is testable in slice 1.
- Clone/survey still decides exact TUI wire point and package reuse vs create (`docs/PROVIDERS.md`, `docs/UPSTREAM.md`).
- CLI branding rename is deferred to a later slice.

## Amendments (grill Round 2, 2026-10-28)

6. Slice 1 turns run through **one selected provider at a time** (no tri-perspective fan-out; that is slice 2).
7. Provider selection / status use **Pi's default agent TUI** mechanisms; do not invent a separate steppi-only picker UI.
8. Credentials/session: **follow upstream Pi conventions first**; add steppi-only storage only when insufficient.
9. Product docs (SPEC/PLAN/ADR/GLOSSARY) stay **English**; chat with 동진 stays Korean.

## Amendments (grill Round 3, 2026-10-28)

10. At Execute, **merge/clone `earendil-works/pi` into this repo** (`donggrri/steppi`) as the product tree (not a thin wrapper + submodule).
11. User-facing TUI/error strings follow **Pi defaults** (English upstream strings); do not invent a parallel Korean UI string pack in slice 1. Prefer Pi's stock mechanisms for most behavior.
12. Live billed provider calls remain **optional** smoke in `docs/SLICE.md`; CI Must uses mocks (FR-110).

