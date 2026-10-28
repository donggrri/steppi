# Spec-first delivery workflow (steppi)

## Purpose

```text
Spec / Explore -> Plan -> Execute -> Review -> Test -> Wrapup
```

Orchestration: **Atomic Workflow** ([donggrri/atomic-graph-workflow](https://github.com/donggrri/atomic-graph-workflow)).  
Engineering craft: **Matt Pocock skills** ([mattpocock/skills](https://github.com/mattpocock/skills)).

Authoritative phase → skill table: [AGENTS.md](../AGENTS.md).

## Layout

| Path | Role |
| --- | --- |
| `.agents/skills/atomic-*` | Atomic orchestration skills |
| `.agents/skills/{to-spec,implement,tdd,...}` | Matt Pocock skills (`skills-lock.json`) |
| `.agent/` | AGY harness marker |
| `.atomic/graph.yaml` | Default delivery graph |
| `.atomic-workflow.json` | Repo settings (`docsRoot`: `work-docs`) |
| `docs/specs/`, `docs/plans/` | Product SPEC/PLAN |
| `work-docs/<slug>/` | Per-run PLAN/TASKS/REVIEW/STATUS |

## Quick map

| Phase | Call |
| --- | --- |
| Spec | `atomic-explore` + `grill-with-docs` + `to-spec` |
| Plan | `atomic-plan` + `to-tickets` |
| Execute | `atomic-execute` / `implement` + `tdd` |
| Review | `atomic-review` + `code-review` |
| Test | PLAN done criteria + TUI manual notes |
| Wrapup | `atomic-wrapup` + `retro` (+ `pr` if PR) |

## Product UI lock

First goal UI is **dashboard TUI only**. Web is out of early slices.

## Gate

Execute (Pi clone / implement) starts only when 동진 explicitly asks.
