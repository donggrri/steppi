# SPEC: steppi slice 1 — Pi packages intact + cursor / antigravity / grok providers

Status: draft → grilling closed pending to-spec publish  
Owner: steppi  
Baseline: none yet (upstream will be `earendil-works/pi` at the commit in
`docs/UPSTREAM.md`)  
Related: `docs/PLAN.md`, `docs/SPEC-steppi-tri-perspective.md`  
Updated: 2026-10-28 (Asia/Seoul) — first goal TUI-based; web out of slice 1

## 1. Problem

steppi must keep **all stock Pi packages usable**, and make **three providers**
first-class: **cursor** (Cursor SDK), **antigravity** (reuse if intent matches, else new headless provider package), and **grok** (login + use). These three are the main
product path. Tri-perspective merge is slice 2.

## 2. Scope

Product UI for this slice (locked): **TUI only**. No web UI work.

In scope:

- Preserve usability of upstream Pi packages
- Cursor provider via SDK
- Antigravity provider via survey → reuse or new headless package
- Grok provider with login
- **Dashboard TUI** as the product UI (extend Pi TUI or steppi TUI package)
- Docs: `UPSTREAM.md`, provider survey notes, `SLICE.md`
- Automated tests with mocks where possible

Out of scope (this slice):

- Tri-perspective fan-out + merge (slice 2)
- Graph stub `steps: a | b`
- **Any web / loopback HTTP dashboard** (Slice 3+ companion only; never first UI)
- Full rich TUI panels beyond the minimum in FR-114 (may slip to slice 1.5)
- Plan approval, graph resume, todos, renaming CLI away from `pi`
- Changing Rust dmuxai
- Breaking or removing stock Pi packages
- Web-first or web-only product

## 3. Definitions

| Term | Meaning |
| --- | --- |
| Provider | A Pi-selectable model/agent backend: `cursor`, `antigravity`, or `grok` |
| Stock Pi packages | Packages shipped by `earendil-works/pi` that must keep working without steppi-only breakage |
| Cursor SDK | Official Cursor SDK used to run work (not an invented HTTP API that pretends to be Cursor) |
| Headless Antigravity | Antigravity driven without requiring its interactive GUI session for the provider path |
| Login (Grok) | User completes Grok auth so subsequent turns use that account |

## 4. Requirements

| ID | Priority | Given | Then | Edge cases | Tests |
| --- | --- | --- | --- | --- | --- |
| FR-100 | Must | Fresh implement start at `/workspace/steppi` | Clone `https://github.com/earendil-works/pi` (not `badlogic/pi-mono`); `upstream` remote set; `docs/UPSTREAM.md` one line (Asia/Seoul date, SHA, tag if any) | Non-empty conflict with docs-only tree → ask | TC-100 |
| FR-101 | Must | After install/build | Stock Pi CLI still starts (help or version exit 0) | Build failure blocks slice | TC-101 |
| FR-102 | Must | Developer or user uses any stock Pi package path documented upstream | That package still works; steppi does not require removing or replacing it | Document any intentional steppi-only package as additive | TC-102 |
| FR-103 | Must | Provider set to `cursor` and SDK credentials/config available | A turn runs through the **Cursor SDK**; no fake network CLI substitute | Missing SDK/auth → clear error naming `cursor` | TC-103, TC-104 |
| FR-104 | Must | Any of the three providers needed | Survey existing packages first (Pi ecosystem / Cursor SDK wrappers / Grok). Reuse when it matches intent; if it does **not** match intent (or none exists), **create** a steppi provider package. Record reuse-vs-create in `docs/PROVIDERS.md`. Antigravity create-path is headless. | Intent mismatch counts as “create”, not force-fit | TC-105, TC-106 |
| FR-105 | Must | Provider set to `antigravity` and backend available | A turn runs via that provider (reused package or new headless) | Missing binary/config → clear error naming `antigravity` | TC-106, TC-107 |
| FR-106 | Must | User chooses Grok and is not logged in | steppi/Pi supports a **login** flow; after success, turns use Grok | Login cancel → no silent fallback to another provider | TC-108 |
| FR-107 | Must | Provider set to `grok` and login valid | A turn runs through Grok | Expired auth → clear re-login error | TC-109 |
| FR-108 | Must | User switches among cursor, antigravity, grok | Each selection routes to the matching provider; others remain installed | Invalid provider name → clear error | TC-110 |
| FR-109 | Must | Core file must change for a provider | Sibling `changes.md` lists upstream behavior, extra behavior, why provider/builtin API was not enough | Prefer package/builtin-only | TC-111 |
| FR-110 | Must | Automated tests | Cover: stock Pi still starts; cursor path (SDK mocked); antigravity missing/config fail; grok not-logged-in fail; provider switch. No live billed calls required | Live smoke optional in `docs/SLICE.md` | TC-112 |
| FR-114 | Must | User runs steppi | Product UI is Pi **default agent TUI** (extend only as needed for providers/status). **No web UI** in this slice | Headless CI may skip interactive TUI; document how | TC-114 |
| FR-115 | Must | Dashboard TUI visible | Shows at least: selected provider among cursor/antigravity/grok, and turn/run status | Richer panels can wait for slice 1.5 / 2 | TC-115 |
| FR-111 | Should | Slice verification complete | `docs/SLICE.md` + `docs/PROVIDERS.md` filled | — | TC-113 |

## 5. Acceptance scenarios and test design

| Test ID | Requirement | Design |
| --- | --- | --- |
| TC-100 | FR-100 | Remotes + `UPSTREAM.md` format; clone URL check |
| TC-101 | FR-101 | Documented Pi CLI help/version exit 0 |
| TC-102 | FR-102 | Smoke or documented checklist that listed stock packages still resolve/import/run |
| TC-103 | FR-103 | Unit/integration: cursor provider calls SDK mock; asserts SDK entry used |
| TC-104 | FR-103 | Missing cursor SDK/auth → failed with message containing `cursor` |
| TC-105 | FR-104 | `docs/PROVIDERS.md` exists and states reuse vs new-package decision with links/reasons |
| TC-106 | FR-104, FR-105 | Antigravity provider module or package is registered and selectable |
| TC-107 | FR-105 | Missing antigravity backend → failed with message containing `antigravity` |
| TC-108 | FR-106 | Not logged in → login required (or equivalent status); no silent other provider |
| TC-109 | FR-107 | Grok provider with mocked valid session completes a stub turn |
| TC-110 | FR-108 | Selecting each of the three providers routes to the matching implementation |
| TC-111 | FR-109 | Review: every core touch has `changes.md` |
| TC-112 | FR-110 | CI/local test suite passes without live providers |
| TC-113 | FR-111 | Manual: `SLICE.md` / `PROVIDERS.md` complete |
| TC-114 | FR-114 | Manual or smoke: terminal starts dashboard TUI; slice ships no web UI path as product surface |
| TC-115 | FR-115 | Manual: dashboard shows selected provider + turn/run status |

## 6. Provider contracts (slice 1)

### cursor

- Transport: **Cursor SDK**
- Must not invent a public HTTP API that pretends to be the Cursor CLI
- Errors name `cursor` and the missing piece (SDK, auth, project)

### Package rule (cursor, antigravity, grok)

1. Search for an existing package that can act as that provider inside Pi
2. If it **matches intent** → reuse it and document how to wire it
3. If it does **not** match intent, or none exists → **create** a steppi provider package
4. Write the survey and decision in `docs/PROVIDERS.md`
5. Antigravity create-path: **headless** mode
6. Errors name the provider id (`cursor` / `antigravity` / `grok`)

### antigravity

Follow the package rule above. Create-path is a headless Antigravity provider package.

### grok

- Support **login** then use
- Errors name `grok` and auth state
- Do not silently fall back to cursor/antigravity on auth failure

## 7. Open questions

1. Exact Pi provider registration API / package layout after clone (`UPSTREAM.md`).
2. Which Cursor SDK package/version to pin (after package survey).
3. Exact dashboard TUI wire point in Pi after clone (extend path confirmed; create only on mismatch).
4. Credential/session storage for Grok (and others): reuse Pi/session conventions vs steppi-specific store — decide after clone survey.

**Closed (2026-10-28):** First goal is **TUI-based**. Web is out of slice 1 / 1.5 / 2; optional companion only in Slice 3+.

**Closed (grill Round 3, 2026-10-28):**
- Execute: this repo becomes the **Pi fork tree** (clone/merge upstream into `donggrri/steppi`).
- User-facing strings/UX: **Pi defaults** (no separate Korean UI pack in slice 1). Most behavior follows Pi stock mechanisms.
- Live provider smoke: optional in `docs/SLICE.md`; mocks required for CI.

**Closed (grill Round 2, 2026-10-28):**
- Slice 1: **one provider per turn** (sequential); no fan-out (slice 2).
- Provider UI: **Pi default agent TUI** mechanisms (not a steppi-only picker).
- Credentials: reuse Pi/session conventions first.
- Docs language: English for SPEC/PLAN/ADR/GLOSSARY.

**Closed (grill Round 1, 2026-10-28):**
- Grok login **entry** is in the dashboard TUI; reuse auth modules internally when they match.
- Dashboard TUI: **prefer extend** Pi agent TUI; create steppi TUI package only on intent mismatch.
- Slice 1 ships **all three** providers as Must (not cursor-first split).
- CLI stays **`pi`** for slice 1 (no `steppi` rename).
- See `GLOSSARY.md`, ADR-0001.

## 8. Approval

Implementation starts only when 동진 leaves the PLAN/SPEC stage.
