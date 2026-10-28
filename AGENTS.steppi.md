# steppi delivery workflow

<!-- atomic:begin -->
# Atomic Workflow

이 저장소는 Atomic Workflow를 사용한다. 어느 에이전트(Cursor, opencode, Codex, Pi, Antigravity, Claude Code)든 같은 규칙을 따른다.

## 1. 라우팅 (모드를 지정하지 않은 코딩 요청)
작업 전에 난이도를 판단하고 한 줄로 알린다: `모드: lite|full — 이유`.
- **full**: 5개 이상 파일, DB/스키마 변경, 인증/보안, 여러 모듈에 걸친 설계, 요구사항 불명확.
- **lite**: 작고 국소적이며 명확한 작업.
- 사용자가 `atomic-lite` / `atomic-plan` 등을 직접 지정하면 그대로 따른다.
- lite 진행 중 위 full 조건을 발견하면 멈추고 full 전환을 제안한다.
- 질문·설명·리뷰처럼 코드를 바꾸지 않는 요청에는 적용하지 않는다.

## 2. 스킬 (노드 지침)
`.agents/skills/` (Claude: `.claude/skills/`)에 있다. 호출 방법은 하네스마다 다르다: `/atomic-plan`, `$atomic-plan`, `/skill:atomic-plan`.
- lite: `atomic-lite`
- full: `atomic-explore → atomic-plan → … → atomic-wrapup`
진행 상태는 `node .atomic/scripts/work-status.mjs list`로 보고, 슬러그 하나는 `show <slug>`, 문서·STATUS 갱신은 `sync <slug> [phase]`로 한다.

## 3. 엔진 (모든 노드의 시작과 끝, Node >=22.13)
```
node .atomic/scripts/work-status.mjs list
node .atomic/scripts/work-status.mjs show <slug>
node .atomic/scripts/work-status.mjs path <slug> [--repo <dir>]
node .atomic/scripts/work-status.mjs sync <slug> [phase]
node .atomic/scripts/memory.mjs repo .
node .atomic/scripts/memory.mjs context <shortRepo>   # 위 repo 출력값
node .atomic/scripts/run-done.mjs "<done-command>" [logPath]
node .atomic/scripts/memory.mjs propose --auto <docsDir>/memory-<slug>.json
```
- 메모리 볼트는 `ATOMIC_WORKFLOW_HOME`(없으면 `~/.atomic-workflow`) 아래 `memory/`다. `propose` JSON은 `shortRepo`, `slug`, `items[]`(`target`: `human.md` | `projects|decisions|gotchas/<name>.md`, `text`: 한 줄·200자 이하) 형식이어야 한다. 승인 대기만 넣을 때는 `propose <file.json>`(without `--auto`); `list` | `approve <id>` | `reject <id>`도 지원한다.
- 상태·문서는 기본 `ATOMIC_WORKFLOW_HOME`(기본 `~/.atomic-workflow`) 아래 `docs/<shortRepo>/<slug>/`에 기록한다. 프로젝트 `.atomic-workflow.json`에 `docsRoot`(예: `work-docs`)가 있으면 해당 저장소 기준 `<repo>/<docsRoot>/<slug>/`에 PLAN·TASKS·REVIEW·STATUS를 쓰고, 실행 로그(runs/evidence)는 전역 홈에 유지한다.
- `node`가 없으면 작업을 멈추고 사용자에게 알린다.

## 4. 역할과 실행기
- 역할 정의는 `.atomic/agents/*.md`. 서브에이전트를 지원하는 하네스는 설치된 서브에이전트를 쓴다.
- 외부 CLI 위임은 `bash .atomic/scripts/invoke-worker.sh ...` 또는 `pwsh -File .atomic/scripts/invoke-worker.sh ...`를 따른다.

## 5. 완료 기준
테스트를 실행해 PLAN의 done criteria와 대조한다. `node .atomic/scripts/doctor.mjs --harness auto --target .`가 실패하면 설치부터 고친다.
<!-- atomic:end -->

## steppi product rules

```text
Spec / Explore -> Plan -> Execute -> Review -> Test -> Wrapup
```

- Product plan: [docs/plans/PLAN-steppi.md](docs/plans/PLAN-steppi.md)
- Specs: [docs/specs/](docs/specs/)
- Atomic run docs: `work-docs/<slug>/` (`docsRoot`)
- Graph: `.atomic/graph.yaml`
- Skills live in `.agents/skills/` (Atomic + [mattpocock/skills](https://github.com/mattpocock/skills))
- AGY marker: `.agent/`
- Skill router when unsure: `ask-matt`

### Locked constraints

- **UI:** first goal is **dashboard TUI only**. No web in early slices.
- **Providers:** cursor (SDK), antigravity, grok (login). Reuse first; create steppi package on intent mismatch.
- **All stock Pi packages must remain usable.**
- Prefer `composer-2.5` for coding cloud work (no `*-fast`). No company/personal data to free/OpenRouter models.
- Do **not** start Execute (clone/implement) until 동진 explicitly asks to implement.

### One-time setup

Before the first engineering flow that uses Matt tickets/spec trackers:

1. Run **`setup-matt-pocock-skills`** (issue tracker, triage labels, domain doc layout).
2. Keep Atomic doctor green: `node .atomic/scripts/doctor.mjs --harness auto --target .`

### Phase → skill map (call these)

Orchestration stays Atomic (`atomic-*`). Discipline and engineering craft come from Matt skills. At each phase, **read and follow** the listed skills (load their `SKILL.md`); do not skip a Must skill for that phase.

| Phase | Atomic (orchestrate / status) | Matt Pocock (must call) | Optional / when |
| --- | --- | --- | --- |
| **Spec / Explore** | `atomic-explore` | `grill-with-docs` (or `grill-me` if no repo paper trail needed); then `to-spec` to capture the accepted SPEC | `research` for primary-source digs; `domain-modeling` / `wayfinder` if the idea is foggy or multi-session; `prototype` + `handoff` if a design question needs throwaway code |
| **Plan** | `atomic-plan` (+ plan-review via graph) | `to-tickets` after the SPEC exists (blocking edges / task graph) | `codebase-design` when choosing module seams; `ask-matt` if the path is unclear |
| **Execute** | `atomic-task` → `atomic-execute` | `implement` (per ticket) or `implement-spec` (whole SPEC as task graph); drive **`tdd`** at every agreed seam | `diagnosing-bugs` on hard failures; `wizard` only for human-only steps |
| **Review** | `atomic-review` | **`code-review`** (Standards + Spec axes vs the SPEC/tickets) | `security-scan` if auth/secrets/provider boundaries touched |
| **Test** | evidence via `run-done` / PLAN done criteria | Keep **`tdd`** red-green evidence; record commands in REVIEW | Manual TUI TC-114/115 when headless CI skips interactive UI |
| **Wrapup** | `atomic-wrapup` | **`retro`** (environment improvements, not more feature code); **`pr`** when opening a PR | `handoff` if switching harness/directory; commit only when 동진 asked |

**Lite path:** `atomic-lite` for small local fixes. Still use `tdd` when adding behavior and `code-review` before wrapup if the change is non-trivial.

**Full path default:**  
`atomic-explore` → `grill-with-docs` → `to-spec` → `atomic-plan` → `to-tickets` → `atomic-execute` / `implement`+`tdd` → `atomic-review` / `code-review` → tests → `atomic-wrapup` + `retro`.

Do not put `setup-matt-pocock-skills` or open-ended `implement` into an automatic pipeline without a human gate. Execute remains gated for steppi until 동진 says go.

### Baseline specs

| Slug | Spec | Plan |
| --- | --- | --- |
| steppi-slice1 | [SPEC-steppi-slice1.md](docs/specs/SPEC-steppi-slice1.md) | [PLAN-steppi.md](docs/plans/PLAN-steppi.md) |
| steppi-tri-perspective | [SPEC-steppi-tri-perspective.md](docs/specs/SPEC-steppi-tri-perspective.md) | (slice 2; after slice 1) |

Status: **prep ready** — Atomic + Matt Pocock skills installed; Execute not started.

## Agent skills

### Issue tracker

GitHub Issues on donggrri/steppi (`gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Default five roles: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context: root `GLOSSARY.md` + `docs/adr/`. See `docs/agents/domain.md`.
