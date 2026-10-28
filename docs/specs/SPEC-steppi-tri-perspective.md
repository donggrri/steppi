# SPEC: steppi slice 2 — tri-perspective investigate + merge

Status: draft  
Owner: steppi  
Depends on: slice 1 providers (`cursor`, `antigravity`, `grok`)  
Related: `docs/PLAN.md`, `docs/SPEC-steppi-slice1.md`  
Updated: 2026-10-28 (Asia/Seoul) — separate package goal

## 1. Problem

동진 wants one investigation to run through **three different perspectives**
(cursor, antigravity, grok), then **merge** those results into a single
synthesis. Slice 1 only makes the providers available; this slice adds fan-out
and merge as a **separate package**.

## 2. Scope

In scope:

- A **dedicated package** for tri-perspective (reuse an existing package only if
  it matches intent; otherwise **create** a steppi package under `packages/`)
- Fan-out to the three providers, collect outputs, merge/synthesize
- Partial-failure behavior, tests with stub providers

Out of scope: live multi-provider CI, full dashboard UI, graph DAG editor,
Rust dmuxai port, inlining the feature only inside the coding-agent builtin
with no package boundary.

## 3. Definitions

| Term | Meaning |
| --- | --- |
| Perspective | One provider's independent answer to the same user question |
| Merge | A single steppi-produced synthesis that cites or separates the three perspectives |
| Partial failure | One or two perspectives fail; merge continues with the rest |

## 4. Requirements

| ID | Priority | Given | Then | Edge cases | Tests |
| --- | --- | --- | --- | --- | --- |
| FR-200 | Must | User starts a tri-perspective investigate on question Q | The **tri-perspective package** runs Q on cursor, antigravity, and grok (order may be parallel or sequential; document choice in UPSTREAM/SLICE). Package is reused if intent matches, else newly created under `packages/`. | Provider timeouts are failures for that perspective | TC-200 |
| FR-201 | Must | All three perspectives return text | User sees one **merged** synthesis plus access to per-perspective raw results | Merge must not drop a perspective that succeeded | TC-201 |
| FR-202 | Must | Exactly one provider fails | Merge uses the two successes; UI/text names the missing perspective and error | Two failures → merge the one success and list both failures | TC-202 |
| FR-203 | Must | All three fail | Clear failure; no fake merged answer | — | TC-203 |
| FR-204 | Must | Automated tests | Three stub providers; assert fan-out and merge content rules; no live APIs | — | TC-204 |
| FR-205 | Should | Docs | `docs/SLICE.md` (or slice-2 section) records how to run tri-perspective | — | TC-205 |
| FR-206 | Must | Slice 2 implementation | Feature is shipped as a **separate package** (not only builtin-inline). `docs/PROVIDERS.md` or `docs/UPSTREAM.md` records reuse-vs-create for this package | Builtin may call the package; it must not be the only home of the logic | TC-206 |

## 5. Acceptance scenarios and test design

| Test ID | Requirement | Design |
| --- | --- | --- |
| TC-200 | FR-200 | Stub providers receive the same Q |
| TC-201 | FR-201 | Merge output includes synthesis and three raw stubs |
| TC-202 | FR-202 | Kill one stub → merge notes missing name |
| TC-203 | FR-203 | All stubs fail → error, no synthesis body pretending success |
| TC-204 | FR-204 | Unit tests only, no network |
| TC-205 | FR-205 | Doc checklist |
| TC-206 | FR-206 | Package exists under `packages/` (or documented reused package); builtin depends on it rather than owning all merge logic |

## 6. Open questions

1. Merge model: which provider writes the synthesis (fourth call) vs local
   heuristic merge?
2. Parallel vs sequential fan-out (cost / rate limits)?
3. User-facing command/UX name for tri-perspective mode?
4. Final package name (placeholder: `steppi-tri-perspective`).

## 7. Approval

Implement after slice 1 is accepted, unless 동진 orders otherwise.
