# Runtime QA assignment

Fill alongside the [assignment specimen](assignment-specimen.md). Technical guidance is [ruach-runtime-testing](../../skills/ruach-runtime-testing/SKILL.md); the [Tester role](../../agents/tester.md) observes rather than fixes or accepts.

```text
Role: Tester. Task/work/version: <IDs>. Coordinator: <ID>.
Outcome/mode: <findings-only exercise | original-failure retest>.
Goals: <required and optional goals, independent expected behavior/authority>.
Owner decisions/limits: <exact words/source/IDs>. Budget: <time/actions>.
Workspace/source: <path/branch and resolved existing SHA>.
Actual build: <build command/version, output/deployment identity/digest,
  dependency/configuration versions; who prepared it>.
Capabilities: <browser DOM/input, desktop input, screenshot/log, playback,
  capture, listening separately; tool/version and observed probe or unknown>.
Resources: <consumer-allocated profile/save copy/port/database/endpoint IDs,
  initial digests/state, owners, permitted fixture writes, retention/release>.
Preserve: <original saves/raw inputs and evidence>. Never use default/live state.
Inputs/workload: <data provenance, size/counts/digest, configuration, seed>.
Viewports: <named CSS width/height, device scale/zoom, device/platform>.
Sequence: <exact actions/timing; original failure steps/state if retesting>.
Measurements if assigned: <metric/unit, contractual budget/source, instrument,
  repeats, cold/warm state and before/after comparability>.
Evidence: <owned screenshots/logs/capture/report paths; privacy/retention rules>.
Protected: application source/tests/config, task record and original data.
Allowed state changes: only <explicit disposable runtime fixtures/actions>.
Report expected/actual, build/state/tools, attempts/results, confidence, evidence,
  source versus runtime attribution, coverage and capability/measurement gaps.
Missing required experience stays held. Audio code/waveform is not listening.
Checks/actions: <exact commands/cwd/bounds or tool actions; allowed escalation>.
Handoff: <durable path>, canonical YAML, exact revisions/build evidence;
  validate with <installed handoff validator --repo command>; <commit rule>.
Return creating SHA externally. No fixes, architecture, worker coordination,
  review acceptance, delivery or task-resource release.
```

For music software, allocate actual playback/listening and isolated session files when those experiences are goals. For a playable prototype, allocate platform/input and copied save state for scene/reload checks. These are assignment options, not completed demonstrations. For design comparisons supply approved recorded fields and palette/tokens; missing fields remain missing. Script timings do not establish frame or speaker latency budgets.
