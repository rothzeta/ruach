---
task: RUACH-0.4-changelog-review
role: reviewer
status: complete
outcome: Changes requested. One blocking finding (the config target can write outside the project) and five should-fix findings (Claude project root, lock takeover race and an untested lock, register quoting and duplicates, test gaps). The normalization, opt-in silence, exit 0 / `{}` and the plugin hook file are otherwise sound.
reviewed_revision: fea6aab8539347b735d35818d63963acf767d32e
tested_revision: fea6aab8539347b735d35818d63963acf767d32e
artifacts:
  - docs/reports/0.4/changelog-review.md
  - docs/assignments/0.4/changelog-review.md
verification:
  - "cd skills/ruach-changelog && bun test (at fea6aab): 16 pass, 0 fail"
  - "just check (at fea6aab): exit 0 (identities, links, tsc)"
  - "bun run test (at fea6aab): 90 pass, 0 fail (root ./tests only; the changelog suite runs under just test)"
  - "scratch copies, outside the reviewed worktree: target escapes reproduced (../, absolute, symlink); Claude subdir cwd reproduced; stale-lock takeover reproduced; lock removed and the concurrency test still passed 3 of 3; with both scripts deleted, 2 of 16 tests pass (subagent, register reject); register with a space in the path and from two copies reproduced"
  - "Claude Code docs (hooks, plugins/components, plugins/manifest-reference) checked: plugin hooks/hooks.json location and format, CLAUDE_PLUGIN_ROOT, async, PostCompact compact_summary, Stop last_assistant_message all confirmed; behaviour of an async non-zero exit unconfirmed"
  - "not run: live Claude, Codex or agy hook invocations"
discoveries:
  - "The skill PROVENANCE.md is the root copy. It describes extraction from tehom-brainlab and does not list ruach-changelog, which was newly authored. This is a repo-wide mechanism, outside this task's scope."
  - "bun run test does not include the skill suites; just test does."
blockers: []
---

# changelog-review

Reviewed `task/changelog` at `fea6aab` (implementation `a8d42df`) in `/opt/dev/ruach-worktrees/ruach-changelog`. The reviewed branch was not edited. Experiments ran on copies in session scratch.

Scope: all changed files are within the assignment's scope (`skills/ruach-changelog/**`, `hooks/hooks.json`, one `justfile` line, `CHANGELOG.md`, design §8 marker, impl report).

## Blocking

### B1. Config `target` can write anywhere the user can write

- **Location:** `skills/ruach-changelog/scripts/changelog.ts:320` (`target = resolve(root, config.target)`), `:283` (`mkdirSync(dirname(target), {recursive: true})`), `:294` (`appendFileSync`).
- **Problem:** the target is not confined to the project. `../x`, an absolute path, or an in-project symlink all resolve outside the project. Directories are created outside the project as well, and the `.lock` file is created next to the target.
- **Why it matters:** the Claude hook ships with the user-scoped plugin and runs on every turn in every project. A cloned repository that commits `.ruach/changelog.json` with `"target": "../../.bashrc"` (or any user-writable file) gets a JSON line appended there on every turn. The line contains assistant text, which repository content can influence. This breaks the requirement that nothing is written outside the project.
- **Evidence:** in scratch, with `proj/.ruach/changelog.json`:
  - `../outside/esc.jsonl` created `outside/esc.jsonl`;
  - an absolute path created `outside/abs.jsonl`;
  - `proj/log.jsonl -> outside/victim.txt` appended the JSON line to `victim.txt`.
- **Suggested direction:**
  - Reject absolute targets.
  - Take the realpath of the project root, and the realpath of the target's nearest existing ancestor, and require the latter to be inside the former.
  - Refuse a target or lock path that is an existing symlink (`lstat`), or open with `O_NOFOLLOW`.
  - Report on stderr and stay exit 0 / `{}`.
  - Add a test for each case: `../`, absolute, symlinked file, and symlinked directory.

## Should fix (non-blocking)

### S1. Claude project root comes from the payload `cwd`, not `CLAUDE_PROJECT_DIR`

- **Location:** `changelog.ts:312` (the order is `--project` → `cwd` → `workspacePaths[0]` → `CLAUDE_PROJECT_DIR`).
- **Problem:** Claude's hook input `cwd` is the session's current directory, which moves when the agent `cd`s in Bash. `CLAUDE_PROJECT_DIR` is the project root. The plugin hook passes no `--project`, so `cwd` wins.
- **Why it matters:** after a `cd sub/`, the hook looks for `sub/.ruach/changelog.json`. It then either logs nothing, silently, or follows a nested config.
- **Evidence:** with payload `cwd=proj/sub` and `CLAUDE_PROJECT_DIR=proj`, nothing was written, although `proj` had opted in.
- **Suggested direction:** for Claude, prefer `CLAUDE_PROJECT_DIR` over `cwd`. For example, make the plugin command pass `--project "${CLAUDE_PROJECT_DIR}"`. Add a test.

### S2. The lock's stale takeover can remove a live lock, and nothing tests the lock

- **Location:** `changelog.ts:287-294`; test `concurrent appends do not interleave lines`.
- **Problem:**
  1. TOCTOU: writers B and C both `stat` an old lock. B unlinks it and creates a fresh lock. C then unlinks B's fresh lock and creates its own, so B and C append concurrently.
  2. A holder that takes longer than 10 s loses its lock to a waiter. In its `finally` block, the slow holder then unlinks the waiter's lock.
  3. A crashed holder is handled: the stale lock is taken over after 10 s. This was reproduced with an mtime one minute old.
- **Why it matters:** mutual exclusion is the documented guarantee, and it does not hold under contention. Corruption is unlikely in practice only because one `O_APPEND` `write` to a local file is effectively atomic on Linux. That same fact explains why the acceptance test cannot detect a broken lock.
- **Evidence:** with `appendLocked` replaced by a bare `appendFileSync`, the concurrency test still passed 3 of 3 runs (12 × 200 KB writers, `/tmp` on tmpfs).
- **Suggested direction (simplest first):**
  - Drop the lock and document the single-`write` `O_APPEND` assumption, ensuring one write call per line.
  - Or keep the lock but never steal it: on timeout, skip the line with a stderr note. Alternatively, remove a stale lock only by renaming it to a unique name and checking it.
  - Make any concurrency test able to fail, for example a deterministic held-lock or stale-lock test.

### S3. Register writes unquoted paths into shell commands

- **Location:** `skills/ruach-changelog/scripts/register.ts:356`.
- **Problem:** `${bun} ${script} ... --project ${project}` is not quoted.
- **Why it matters:**
  - A path with a space splits into several arguments. The hook then gets the wrong `--project` and does nothing, silently.
  - Shell metacharacters in a path would be interpreted by the harness shell.
- **Evidence:** `--project ".../repo with space"` produced `... --project /…/x/repo with space`.
- **Suggested direction:** shell-quote each path (single quotes with escaping), and add a test with a space in the path.

### S4. Register recognises its own entries by exact script path, so it duplicates them

- **Location:** `register.ts:357` (`isOurs` matches `script`, the absolute path of whichever copy ran).
- **Problem:** running register from another copy keeps the old entry and adds a new one. Copies differ between the source checkout, a consumer `.agents/skills` snapshot, and a versioned plugin cache path after an update.
- **Why it matters:** each turn is then logged twice. Alternatively, a stale entry points at a removed path and errors on every turn.
- **Evidence:** registering from `skill/` and then from `skill2/` left 2 Ruach `Stop` entries in `.codex/hooks.json`.
- **Suggested direction:** match a stable marker instead, such as `ruach-changelog/scripts/changelog.ts` or a dedicated argument token, and replace on match.

### S5. Test gaps behind the "vacuous passes"

- **Problem:** with both scripts deleted, the 2 tests that still pass are `subagent payloads produce nothing` and `rejects a missing project directory without writing`. Both only assert absence or failure. The subagent test does not check exit 0 or `{}`, and has no control line showing the same project does log non-subagent payloads.
- **Also missing:**
  - tests for B1, S1, S2 (stale lock) and S3;
  - agy registration merging with an existing `.agents/hooks.json`;
  - the Claude async entry's exact command.
- **Evidence:** a mutation run in scratch (scripts removed): 2 pass, 14 fail. The 2 passes are exactly the tests named above.
- **Suggested direction:**
  - Assert `[status, stdout] = [0, '{}']` in the subagent test, and add a non-subagent control in the same project.
  - Add the missing tests listed above.

## Optional

- **O1.** `register.ts:377`: a valid `.codex/hooks.json` whose event value is not an array crashes with an uncaught `TypeError` stack trace (exit 1). Nothing is written. Prefer a clear message and exit 2, as for invalid JSON.
- **O2.** `tests/changelog.test.ts` (`config without a target…`) writes a stray `.ruach-tmp` file that nothing asserts on. Remove it.
- **O3.** The PROVENANCE wording does not fit a newly authored skill (see discoveries). This is for the coordinator; it is outside this task's scope.

## Checked and sound

- **Normalization**, by fixtures and code:
  - Claude `Stop` and `PostCompact` (`compact_summary`);
  - Codex `Stop` with `turn_id`;
  - Codex `PostCompact` gives `text: null` with a reason;
  - agy `Stop` takes the last `PLANNER_RESPONSE` `content` from `transcriptPath`;
  - an unreadable transcript gives `text: null` with a reason;
  - the `kinds` filter.
- **Subagents:** `agent_id`/`agentId` payloads are skipped.
- **Opt-in silence:** without the config, the hook writes nothing and touches nothing in the project.
- **Never blocks:** every path ends in `try`/`catch`, then `{}` on stdout and exit 0, including a lock timeout (≤ 20 s, which is within agy's 30 s).
- **Registration:**
  - writes only `<repo>/.codex/hooks.json` and `<repo>/.agents/hooks.json`, with absolute paths;
  - keeps unrelated Codex entries and other agy top-level keys;
  - reads both files before writing either, so invalid JSON leaves both untouched;
  - writes nothing to `HOME` or the caller's cwd (tested);
  - `scripts/install.ts` does not prune `.agents/hooks.json`.
- **Simplicity:** proportionate. The only candidate for removal is the lock (S2).

### Claude plugin hook

`hooks/hooks.json` is at the plugin root. It uses the `{"hooks": {"Stop": [{"hooks": [{"type":"command", ...}]}]}}` format, `${CLAUDE_PLUGIN_ROOT}` and `"async": true`, and `.claude-plugin/plugin.json` declares no `hooks` field. All of these are **confirmed** against the official docs (checked 2026-10-08):

- [plugins/components](https://code.claude.com/docs/en/plugins/components): `hooks/hooks.json` at the plugin root, with a top-level `"hooks"` key, loads automatically.
- [plugins/manifest-reference](https://code.claude.com/docs/en/plugins/manifest-reference): `${CLAUDE_PLUGIN_ROOT}` is expanded in `command`.
- [hooks](https://code.claude.com/docs/en/hooks):
  - `async` is valid only on command hooks;
  - `Stop` has no matcher and its input has `last_assistant_message`;
  - `PostCompact` input has `trigger` and `compact_summary`;
  - `agent_id` is present only inside a subagent, and subagents end with `SubagentStop`;
  - `CLAUDE_PROJECT_DIR` is exported to hook commands and is "the project root where the session started", while `cwd` is the "current working directory when the hook is invoked". This supports S1.

Unconfirmed: the docs do not say what an async hook's non-zero exit does. For example, `bun` missing from `PATH` (127) probably shows a non-blocking failure notice on every turn in every project. Optional: guard the command, e.g. `command -v bun >/dev/null || exit 0`.
