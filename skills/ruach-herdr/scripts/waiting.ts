#!/usr/bin/env bun
// External lifecycle bridge, inspired by Sandalphon's Round9 monitor/remote scripts.
// This is separate from worker.ts: it never launches, replaces or closes an agent.
import { createHash, randomUUID } from 'node:crypto';
import {
  closeSync,
  existsSync,
  fsyncSync,
  mkdirSync,
  openSync,
  readFileSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { dirname, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { run } from './process';
import { CodexContinuation } from './wait-codex';

export type Identity = {
  name: string;
  kind: string;
  pane: string;
  session: string;
};
export type Worker = Identity & {
  assignment: string;
  after_seq: number;
  handoff: string;
};
export type WaitRecord = {
  workflow: string;
  generation: string;
  state: 'active' | 'awaiting-workers' | 'completed';
  coordinator: Identity;
  workers: Worker[];
  handled: { event: string; disposition: string }[];
};
export type Agent = {
  name?: string;
  agent: string;
  pane_id: string;
  agent_session?: { kind: string; value: string };
  agent_status: string;
  state_change_seq: number;
};
export type Event = {
  id: string;
  worker: Worker;
  state: string;
  seq: number;
  created: number;
  handled?: string;
};
type Attempt = {
  ids: string[];
  at: number;
  baseline: number;
  submitted?: boolean;
  started?: number;
  turn?: string;
  delivery: string;
};
type Journal = {
  workflow: string;
  generation: string;
  coordinator: Identity;
  events: Event[];
  attempt?: Attempt;
  attempts: number;
  heartbeat: number;
  status: string;
  error?: string;
};
// Adapters verify native identity/capability and expose continuation operations only.
// The Watcher owns events, persistence, retries and durable acknowledgement.
export interface Continuation {
  check(identity: Identity): Promise<void>;
  wake(
    identity: Identity,
    text: string,
    deliveryId: string,
  ): Promise<{ submitted: boolean; turn?: string }>;
  receipt(
    identity: Identity,
    delivery: string,
  ): Promise<{ queued: boolean; turn?: string }>;
  cancel(identity: Identity, delivery: string): Promise<void>;
}
export interface Transport {
  list(): Promise<Agent[]>;
  // Enqueue receipt is distinct from the separately correlated actual native turn.
  wake(
    identity: Identity,
    text: string,
    deliveryId: string,
  ): Promise<{ submitted: boolean; turn?: string }>;
  check(identity: Identity): Promise<void>;
  receipt?(
    identity: Identity,
    delivery: string,
  ): Promise<{ queued: boolean; turn?: string }>;
  cancel?(identity: Identity, delivery: string): Promise<void>;
}
const same = (a: Agent, b: Identity) =>
  a.name === b.name &&
  a.agent === b.kind &&
  a.pane_id === b.pane &&
  a.agent_session?.kind === 'id' &&
  a.agent_session.value === b.session;
const sameIdentity = (a: Identity | undefined, b: Identity) =>
  a !== undefined &&
  a.name === b.name &&
  a.kind === b.kind &&
  a.pane === b.pane &&
  a.session === b.session;
const ready = (a: Agent) => ['idle', 'done'].includes(a.agent_status);
const hash = (value: unknown) =>
  createHash('sha256').update(JSON.stringify(value)).digest('hex');
function identity(value: any): boolean {
  return (
    value &&
    ['name', 'kind', 'pane', 'session'].every(
      (k) => typeof value[k] === 'string' && value[k].length > 0,
    )
  );
}
export function readRecord(path: string): WaitRecord {
  const blocks = [
    ...readFileSync(path, 'utf8').matchAll(
      /^```ruach-wait\n([\s\S]*?)^```\s*$/gm,
    ),
  ];
  if (blocks.length !== 1)
    throw new Error(
      'Task record must contain exactly one ruach-wait JSON block',
    );
  const r = JSON.parse(blocks[0][1]);
  if (
    !r ||
    typeof r.workflow !== 'string' ||
    !r.workflow ||
    typeof r.generation !== 'string' ||
    !r.generation ||
    !['active', 'awaiting-workers', 'completed'].includes(r.state) ||
    !identity(r.coordinator) ||
    !Array.isArray(r.workers) ||
    !r.workers.every(
      (w: any) =>
        identity(w) &&
        typeof w.assignment === 'string' &&
        w.assignment &&
        Number.isSafeInteger(w.after_seq) &&
        w.after_seq >= 0 &&
        typeof w.handoff === 'string' &&
        w.handoff,
    ) ||
    new Set(r.workers.map((w: Worker) => w.assignment)).size !==
      r.workers.length ||
    !Array.isArray(r.handled) ||
    !r.handled.every(
      (h: any) =>
        typeof h.event === 'string' &&
        h.event &&
        typeof h.disposition === 'string' &&
        h.disposition,
    )
  )
    throw new Error(
      'Invalid waiting record (a pinned authoritative native session is required)',
    );
  return r;
}
// Rename plus fsync: an event or uncertain submission is durable before any external effect.
function save(path: string, value: unknown) {
  mkdirSync(dirname(path), { recursive: true, mode: 0o700 });
  const tmp = path + '.partial',
    fd = openSync(tmp, 'w', 0o600);
  try {
    writeFileSync(fd, JSON.stringify(value, null, 2) + '\n');
    fsyncSync(fd);
  } finally {
    closeSync(fd);
  }
  renameSync(tmp, path);
  const dir = openSync(dirname(path), 'r');
  try {
    fsyncSync(dir);
  } finally {
    closeSync(dir);
  }
}

function recordObservation(
  j: Journal,
  r: WaitRecord,
  w: Worker,
  a: Agent | undefined,
  now: number,
) {
  const state = a?.agent_status ?? 'failed',
    seq = a?.state_change_seq ?? w.after_seq;
  if (
    a &&
    (seq <= w.after_seq ||
      !['done', 'idle', 'blocked', 'unknown'].includes(state))
  )
    return;
  const id = hash([
    r.workflow,
    r.generation,
    w.assignment,
    w.name,
    w.kind,
    w.pane,
    w.session,
    seq,
    state,
  ]);
  if (!j.events.some((e) => e.id === id)) {
    const handled = r.handled.find((h) => h.event === id)?.disposition;
    j.events.push({
      id,
      worker: w,
      state,
      seq,
      created: now,
      ...(handled ? { handled } : {}),
    });
  }
}

// One reconciliation is also the public deterministic boundary used by controlled-time tests.
export class Watcher {
  private checked = false;
  constructor(
    readonly record: string,
    readonly journal: string,
    readonly transport: Transport,
    readonly retryMs = 15000,
    readonly maxAttempts = 3,
  ) {
    if (resolve(record) === resolve(journal))
      throw new Error(
        'Operational journal must be separate from the Coordinator task record',
      );
  }
  // Called synchronously for a received lifecycle snapshot, before any next status read.
  capture(observed: Agent, now = Date.now()) {
    const r = readRecord(this.record);
    if (r.state === 'completed') return;
    const j: Journal = JSON.parse(readFileSync(this.journal, 'utf8'));
    if (j.workflow !== r.workflow || j.generation !== r.generation)
      throw new Error('Notification generation mismatch');
    for (const w of r.workers)
      if (same(observed, w)) recordObservation(j, r, w, observed, now);
    save(this.journal, j);
  }
  async step(now = Date.now()): Promise<Journal> {
    let r: WaitRecord;
    try {
      r = readRecord(this.record);
    } catch (error) {
      if (existsSync(this.journal)) {
        const previous = JSON.parse(readFileSync(this.journal, 'utf8'));
        save(this.journal, {
          ...previous,
          status: 'failed',
          error: (error as Error).message,
          heartbeat: now,
        });
      }
      throw error;
    }
    let j: Journal = existsSync(this.journal)
      ? JSON.parse(readFileSync(this.journal, 'utf8'))
      : {
          workflow: r.workflow,
          generation: r.generation,
          coordinator: r.coordinator,
          events: [],
          attempts: 0,
          heartbeat: now,
          status: 'starting',
        };
    if (j.workflow !== r.workflow || j.generation !== r.generation)
      throw new Error(
        'Journal belongs to another workflow/generation; retain it and choose a new journal',
      );
    if (!sameIdentity(j.coordinator, r.coordinator))
      throw new Error(
        'Journal Coordinator identity mismatch; reconcile the original native session before recovery',
      );
    const persist = () => {
      j.heartbeat = now;
      save(this.journal, j);
      return j;
    };
    try {
      for (const e of j.events) {
        const h = r.handled.find((h) => h.event === e.id);
        if (h) e.handled = h.disposition;
      }
      if (r.state === 'completed') {
        if (j.attempt) {
          const receipt = await this.transport.receipt?.(
            r.coordinator,
            j.attempt.delivery,
          );
          if (receipt?.turn) {
            j.attempt.started ??= now;
            j.attempt.turn = receipt.turn;
          }
          await this.transport.cancel?.(r.coordinator, j.attempt.delivery);
        }
        j.status = 'completed';
        delete j.error;
        return persist();
      }
      const agents = await this.transport.list();
      const coordinator = agents.find((a) => same(a, r.coordinator));
      if (!coordinator)
        throw new Error(
          'Pinned Coordinator unavailable or native session changed; no replacement or fallback',
        );
      if (!this.checked) {
        await this.transport.check(r.coordinator);
        this.checked = true;
      }
      for (const w of r.workers)
        recordObservation(
          j,
          r,
          w,
          agents.find((a) => same(a, w)),
          now,
        );
      // An assignment removed from the record is not automatically handled. Its event stays queued.
      const pending = j.events.filter((e) => !e.handled);
      if (
        j.attempt &&
        j.attempt.ids.every((id) =>
          j.events.some((e) => e.id === id && e.handled),
        )
      ) {
        await this.transport.cancel?.(r.coordinator, j.attempt.delivery);
        delete j.attempt;
        j.attempts = 0;
      }
      if (j.attempt) {
        const receipt = await this.transport.receipt?.(
          r.coordinator,
          j.attempt.delivery,
        );
        if (receipt?.turn) {
          j.attempt.started ??= now;
          j.attempt.turn = receipt.turn;
        }
      }
      j.status = 'armed';
      delete j.error;
      persist(); // Includes events discovered during the transition to parking.
      if (
        !pending.length ||
        r.state !== 'awaiting-workers' ||
        !ready(coordinator)
      )
        return j;
      if (j.attempt && now - (j.attempt.started ?? j.attempt.at) < this.retryMs)
        return j;
      if (j.attempts >= this.maxAttempts)
        throw new Error(
          'Wake unhandled after bounded retries; operator recovery required',
        );
      // Re-read both boundaries immediately before delivery; never intentionally steer a busy turn.
      const latest = readRecord(this.record);
      if (
        latest.state !== 'awaiting-workers' ||
        JSON.stringify(latest) !== JSON.stringify(r)
      )
        return j;
      const current = (await this.transport.list()).find((a) =>
        same(a, r.coordinator),
      );
      if (!current)
        throw new Error('Pinned Coordinator disappeared before delivery');
      if (
        !ready(current) ||
        current.state_change_seq !== coordinator.state_change_seq
      )
        return j;
      const batch =
        j.attempt && j.attempt.started === undefined
          ? j.events.filter((e) => j.attempt!.ids.includes(e.id))
          : pending;
      const ids = batch.map((e) => e.id);
      const delivery =
        j.attempt && j.attempt.started === undefined
          ? j.attempt.delivery
          : randomUUID();
      j.attempt = {
        ids,
        at: now,
        baseline: current.state_change_seq,
        delivery,
      };
      j.attempts++;
      persist(); // A crash after this point is an uncertain send; reconcile before retrying.
      const text = `Ruach worker events: ${JSON.stringify(batch)}\nRead ${JSON.stringify(this.record)}. Reconcile event and worker identities, read relevant handoffs, and append each handled disposition to its ruach-wait handled array using exactly {"event":"<delivered event id>","disposition":"<durable outcome and next action identity>"} before dependent actions. The event object uses id; the handled record must use event, not id. Preserve other record fields. Reuse recorded assignments/acceptances/delivery identities; duplicate events confer no new action. Continue authorized work or park with the watcher armed. Do not set any wait timer or call idle wait tools. This is a continuation of this session, not workflow completion.`;
      const receipt = await this.transport.wake(r.coordinator, text, delivery);
      j.attempt.submitted = receipt.submitted;
      if (receipt.turn) {
        j.attempt.started = now;
        j.attempt.turn = receipt.turn;
      } else
        j.error =
          'Turn start unconfirmed; retain events and reconcile before retry';
      return persist();
    } catch (error) {
      j.status = 'failed';
      j.error = (error as Error).message;
      persist();
      throw error;
    }
  }
}

export class HerdrTransport implements Transport {
  constructor(
    readonly cwd: string,
    readonly executable = 'herdr',
    readonly continuation: Continuation = new CodexContinuation(cwd),
  ) {}
  async list(): Promise<Agent[]> {
    const result = await run([this.executable, 'agent', 'list'], this.cwd);
    if (result.exit !== 0 || result.timedOut)
      throw new Error('Herdr status unavailable');
    const agents = JSON.parse(result.stdout).result?.agents;
    if (
      !Array.isArray(agents) ||
      agents.some((a) => typeof a.state_change_seq !== 'number')
    )
      throw new Error('Unusable Herdr lifecycle response');
    return agents;
  }
  async receipt(id: Identity, delivery: string) {
    return this.continuation.receipt(id, delivery);
  }
  async cancel(id: Identity, delivery: string) {
    await this.continuation.cancel(id, delivery);
  }
  async check(id: Identity) {
    await this.continuation.check(id);
  }
  async wake(id: Identity, text: string, deliveryId: string) {
    return this.continuation.wake(id, text, deliveryId);
  }
  async notification(
    workers: Worker[],
    interval: number,
    capture: (a: Agent) => void,
  ) {
    // Herdr's agent.wait subscribes to lifecycle changes. Periodic list reconciles dropped events.
    // Select all states except the current one to avoid immediate-repeat idle notifications.
    const agents = await this.list();
    for (const w of workers) {
      const a = agents.find((a) => same(a, w));
      if (a) capture(a);
    }
    const results = await Promise.allSettled([
      Bun.sleep(interval),
      ...workers.map(async (w) => {
        const a = agents.find((a) => same(a, w));
        if (!a) return Bun.sleep(interval);
        const states = ['idle', 'done', 'working', 'blocked', 'unknown'].filter(
          (s) => s !== a.agent_status,
        );
        const result = await run(
          [
            this.executable,
            'agent',
            'wait',
            w.name,
            ...states.flatMap((s) => ['--until', s]),
            '--timeout',
            String(interval),
          ],
          this.cwd,
          interval + 1000,
        );
        if (result.exit === 0 && !result.timedOut) {
          const observed = JSON.parse(result.stdout).result?.agent;
          if (!observed || !Number.isSafeInteger(observed.state_change_seq))
            throw new Error('Unusable Herdr lifecycle notification');
          capture(observed); // Persist a transient blocker/completion even if the next read is working.
        }
      }),
    ]);
    for (const result of results)
      if (result.status === 'rejected') throw result.reason;
  }
}

function claim(path: string) {
  const lock = path + '.lock';
  try {
    mkdirSync(lock, { mode: 0o700 });
  } catch {
    throw new Error(
      'Watcher lock exists; verify recorded PID has ended before removing the lock',
    );
  }
  writeFileSync(resolve(lock, 'pid'), String(process.pid));
  return () => rmSync(lock, { recursive: true });
}
export async function main(argv: string[], continuation?: Continuation) {
  const { values, positionals } = parseArgs({
    args: argv,
    allowPositionals: true,
    options: {
      record: { type: 'string' },
      journal: { type: 'string' },
      interval: { type: 'string', default: '4000' },
      'retry-ms': { type: 'string', default: '15000' },
    },
  });
  if (
    positionals.length !== 1 ||
    !['watch', 'status'].includes(positionals[0]) ||
    !values.record ||
    !values.journal
  )
    throw new Error(
      'Usage: waiting.ts watch|status --record TASK.md --journal PRIVATE/events.json [--interval 4000] [--retry-ms 15000]',
    );
  const record = resolve(values.record),
    journal = resolve(values.journal),
    interval = Number(values.interval),
    retry = Number(values['retry-ms']);
  if (
    !Number.isSafeInteger(interval) ||
    interval < 100 ||
    !Number.isSafeInteger(retry) ||
    retry < 1000
  )
    throw new Error('Invalid interval/retry');
  mkdirSync(dirname(journal), { recursive: true, mode: 0o700 });
  if (positionals[0] === 'status') {
    const r = readRecord(record),
      j: Journal = JSON.parse(readFileSync(journal, 'utf8'));
    const pid = Number(readFileSync(journal + '.lock/pid', 'utf8'));
    process.kill(pid, 0);
    if (
      j.workflow !== r.workflow ||
      j.generation !== r.generation ||
      !sameIdentity(j.coordinator, r.coordinator) ||
      j.status !== 'armed' ||
      Date.now() - j.heartbeat < 0 ||
      Date.now() - j.heartbeat > interval * 3 + 10000
    )
      throw new Error(
        'Watcher not armed for this Coordinator or heartbeat stale',
      );
    console.log(
      JSON.stringify({
        status: 'armed',
        workflow: j.workflow,
        generation: j.generation,
        coordinator: j.coordinator,
        pending: j.events.filter((e) => !e.handled).length,
      }),
    );
    return;
  }
  const release = claim(journal);
  let stopped = false;
  const stop = () => {
    stopped = true;
  };
  process.on('SIGTERM', stop);
  process.on('SIGINT', stop);
  try {
    const transport = new HerdrTransport(
      dirname(record),
      'herdr',
      continuation,
    );
    const watcher = new Watcher(record, journal, transport, retry);
    let failures = 0;
    while (!stopped) {
      try {
        const result = await watcher.step();
        if (result.status === 'completed') return;
        await transport.notification(
          readRecord(record).workers,
          interval,
          (a) => watcher.capture(a),
        );
        failures = 0;
      } catch (error) {
        if (++failures >= 3) throw error;
        await Bun.sleep(interval); // External retry only; the failed journal remains visible.
      }
    }
  } finally {
    release();
    process.off('SIGTERM', stop);
    process.off('SIGINT', stop);
  }
}
if (import.meta.main)
  main(process.argv.slice(2)).catch((e) => {
    console.error(`External waiting failed: ${e.message}`);
    process.exitCode = 1;
  });
