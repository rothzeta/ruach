#!/usr/bin/env bun
// Append one normalized changelog line per hook payload (single O_APPEND write, no lock). Never blocks a turn: always exits 0 and prints `{}`.
import { constants, closeSync, existsSync, lstatSync, mkdirSync, openSync, readFileSync, realpathSync, writeSync } from 'node:fs';
import { dirname, isAbsolute, relative, resolve } from 'node:path';

type Payload = Record<string, unknown>;
type Harness = 'claude' | 'codex' | 'agy';
export interface Entry { timestamp: string; harness: Harness; session: string | null; turn: string | number | null; kind: 'turn' | 'compaction'; text: string | null; reason?: string }

const str = (v: unknown): string | null => (typeof v === 'string' && v ? v : null);

export function detect(p: Payload): Harness {
  if ('conversationId' in p || 'transcriptPath' in p) return 'agy';
  if ('turn_id' in p) return 'codex';
  return 'claude';
}

function agyText(path: string | null): { text: string | null; reason?: string } {
  if (!path) return { text: null, reason: 'payload has no transcriptPath' };
  let raw: string;
  try { raw = readFileSync(path, 'utf8'); } catch { return { text: null, reason: 'transcript unreadable' }; }
  let last: string | null = null;
  for (const line of raw.split('\n')) {
    try {
      const entry = JSON.parse(line);
      if (entry?.type === 'PLANNER_RESPONSE' && typeof entry.content === 'string') last = entry.content;
    } catch { /* skip malformed transcript lines */ }
  }
  return last === null ? { text: null, reason: 'transcript has no PLANNER_RESPONSE' } : { text: last };
}

/** Normalize a payload, or return null for payloads that must not be logged (subagents). */
export function normalize(p: Payload, hint?: string): Entry | null {
  if (str(p.agent_id) || str(p.agentId)) return null;
  const harness = hint === 'claude' || hint === 'codex' || hint === 'agy' ? hint : detect(p);
  const timestamp = new Date().toISOString();
  if (harness === 'agy') {
    const turn = typeof p.executionNum === 'number' || typeof p.executionNum === 'string' ? p.executionNum : null;
    return { timestamp, harness, session: str(p.conversationId), turn, kind: 'turn', ...agyText(str(p.transcriptPath)) };
  }
  const event = str(p.hook_event_name);
  const compaction = event ? event === 'PostCompact' : 'compact_summary' in p;
  const session = str(p.session_id);
  if (compaction) {
    const text = str(p.compact_summary);
    return { timestamp, harness, session, turn: null, kind: 'compaction', text, ...(text ? {} : { reason: 'harness provides no compaction text' }) };
  }
  const text = str(p.last_assistant_message);
  return { timestamp, harness, session, turn: str(p.turn_id), kind: 'turn', text, ...(text ? {} : { reason: 'payload has no last_assistant_message' }) };
}

/** Resolve a configured target inside the project, or throw. Rejects absolute paths, symlinked files and escapes via symlinked directories. */
export function confine(root: string, configured: string): string {
  if (isAbsolute(configured)) throw new Error('"target" must be relative to the project');
  const base = realpathSync(root), target = resolve(base, configured);
  let ancestor = target;
  for (;;) {
    try { lstatSync(ancestor); break; } catch { const parent = dirname(ancestor); if (parent === ancestor) throw new Error('"target" has no existing ancestor'); ancestor = parent; }
  }
  const real = realpathSync(ancestor), inside = relative(base, real);
  if (inside.startsWith('..') || isAbsolute(inside) || relative(base, target).startsWith('..')) throw new Error('"target" resolves outside the project');
  if (ancestor === target && lstatSync(target).isSymbolicLink()) throw new Error('"target" is a symbolic link');
  return target;
}

/** One O_APPEND write call per line: the kernel appends it atomically for a regular local file, so concurrent writers cannot interleave. No lock is used. */
export function appendLine(target: string, line: string): void {
  mkdirSync(dirname(target), { recursive: true });
  const fd = openSync(target, constants.O_WRONLY | constants.O_APPEND | constants.O_CREAT | constants.O_NOFOLLOW, 0o600);
  try {
    const bytes = Buffer.from(line);
    if (writeSync(fd, bytes) !== bytes.length) throw new Error('short write; line may be incomplete');
  } finally { closeSync(fd); }
}

function option(argv: string[], name: string): string | undefined {
  const i = argv.indexOf(name);
  return i >= 0 ? argv[i + 1] : undefined;
}

function main(): void {
  const argv = process.argv.slice(2);
  let payload: Payload;
  try {
    const parsed = JSON.parse(readFileSync(0, 'utf8'));
    if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('payload is not an object');
    payload = parsed;
  } catch (error) { console.error(`ruach-changelog: unusable hook input: ${(error as Error).message}`); return; }

  const workspaces = Array.isArray(payload.workspacePaths) ? str(payload.workspacePaths[0]) : null;
  const harness = option(argv, '--harness') || detect(payload);
  const claudeDir = harness === 'claude' ? process.env.CLAUDE_PROJECT_DIR : undefined;
  const root = option(argv, '--project') || claudeDir || str(payload.cwd) || workspaces || process.env.CLAUDE_PROJECT_DIR || process.cwd();
  const configPath = resolve(root, '.ruach/changelog.json');
  if (!existsSync(configPath)) return; // not opted in
  let target: string, kinds: string[];
  try {
    const config = JSON.parse(readFileSync(configPath, 'utf8'));
    if (typeof config?.target !== 'string' || !config.target) throw new Error('config declares no "target"');
    if (!Array.isArray(config.kinds)) throw new Error('config declares no "kinds" array');
    target = confine(root, config.target);
    kinds = config.kinds;
  } catch (error) { console.error(`ruach-changelog: ${configPath}: ${(error as Error).message}`); return; }

  const entry = normalize(payload, harness);
  if (!entry || !kinds.includes(entry.kind)) return;
  appendLine(target, `${JSON.stringify(entry)}\n`);
}

if (import.meta.main) {
  try { main(); } catch (error) { console.error(`ruach-changelog: ${(error as Error).message}`); }
  process.stdout.write('{}');
  process.exit(0);
}
