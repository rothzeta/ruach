import { afterEach, expect, test } from 'bun:test';
import { createServer } from 'node:http';
import { createRequire } from 'node:module';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import type {
  Agent,
  Identity,
  WaitRecord,
} from '../skills/ruach-herdr/scripts/waiting';

const source = resolve(import.meta.dir, '..');
const require = createRequire(join(source, 'skills/ruach-herdr/package.json'));
const { WebSocketServer } = require('ws');
const cleanup: (() => Promise<void>)[] = [];

afterEach(async () => {
  for (const release of cleanup.splice(0).reverse()) await release();
});

async function until(assertion: () => void) {
  const deadline = Date.now() + 10000;
  for (;;) {
    try {
      assertion();
      return;
    } catch (error) {
      if (Date.now() >= deadline) throw error;
      await Bun.sleep(10);
    }
  }
}

async function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'ruach-consumer-wait-'));
  cleanup.push(async () => rmSync(root, { recursive: true, force: true }));
  const coordinator = {
    name: 'coord',
    kind: 'codex',
    pane: 'w1:p1',
    session: 'original-session',
  };
  const worker = {
    name: 'impl',
    kind: 'codex',
    pane: 'w2:p1',
    session: 'original-worker',
    assignment: 'impl-1',
    after_seq: 1,
    handoff: 'report.md',
  };
  const record: WaitRecord = {
    workflow: 'consumer',
    generation: 'one',
    state: 'awaiting-workers',
    coordinator,
    workers: [worker],
    handled: [],
  };
  const agent = (id: Identity, state: string, seq: number): Agent => ({
    name: id.name,
    agent: id.kind,
    pane_id: id.pane,
    agent_session: { kind: 'id', value: id.session },
    agent_status: state,
    state_change_seq: seq,
  });
  const agents = [agent(coordinator, 'idle', 1), agent(worker, 'working', 2)];
  const task = join(root, 'task.md'),
    journal = join(root, 'journal.json'),
    lifecycle = join(root, 'agents.json'),
    notification = join(root, 'notification.json');
  writeFileSync(notification, 'null');
  const save = () => {
    writeFileSync(
      task,
      `# Consumer task\n\n\`\`\`ruach-wait\n${JSON.stringify(record)}\n\`\`\`\n`,
    );
    writeFileSync(lifecycle, JSON.stringify(agents));
  };
  const read = () => JSON.parse(readFileSync(journal, 'utf8'));
  const queued: any[] = [],
    turns: any[] = [],
    calls: string[] = [];
  let interrupted = false;
  const server = createServer(),
    wss = new WebSocketServer({ server });
  const socket = join(root, 'native.sock');
  wss.on('connection', (ws: any) =>
    ws.on('message', (bytes: Buffer) => {
      const message = JSON.parse(bytes.toString()),
        p = message.params;
      calls.push(message.method);
      if (message.id === undefined) return;
      if (message.method !== 'initialize')
        expect(p.threadId).toBe(coordinator.session);
      let result: unknown;
      switch (message.method) {
        case 'initialize':
          result = {};
          break;
        case 'thread/read':
          result = { thread: { id: coordinator.session } };
          break;
        case 'thread/queue/list':
          result = { data: queued, nextCursor: null };
          break;
        case 'thread/turns/list':
          result = { data: turns };
          break;
        case 'thread/queue/add': {
          // The real consumer command must persist the stable attempt before sending.
          expect(read().attempt.delivery).toBe(p.clientUserMessageId);
          const item = {
            id: 'native-' + queued.length,
            clientUserMessageId: p.clientUserMessageId,
          };
          queued.push(item);
          if (interrupted) {
            interrupted = false;
            ws.close();
            return;
          }
          result = { queuedSubmission: item };
          break;
        }
        case 'thread/queue/delete': {
          queued.splice(
            queued.findIndex((q) => q.id === p.queuedSubmissionId),
            1,
          );
          result = {};
          break;
        }
        default:
          throw new Error('Forbidden native operation: ' + message.method);
      }
      ws.send(JSON.stringify({ id: message.id, result }));
    }),
  );
  await new Promise<void>((done, reject) =>
    server.once('error', reject).listen(socket, done),
  );
  cleanup.push(async () => {
    for (const ws of wss.clients) ws.terminate();
    await new Promise<void>((done) =>
      wss.close(() => server.close(() => done())),
    );
  });
  writeFileSync(
    join(root, 'codex'),
    `#!/usr/bin/env bun\nconsole.log(${JSON.stringify(JSON.stringify({ status: 'running', socketPath: socket, appServerVersion: 'fixture', cliVersion: 'fixture' }))});\n`,
    { mode: 0o755 },
  );
  // Notifications are dropped until explicitly supplied; supplied snapshots repeat.
  writeFileSync(
    join(root, 'herdr'),
    `#!/usr/bin/env bun
if (process.argv[3] === 'list') console.log(JSON.stringify({result:{agents:await Bun.file(${JSON.stringify(lifecycle)}).json()}}));
else {
  await Bun.sleep(100);
  const observed = await Bun.file(${JSON.stringify(notification)}).json();
  if (!observed) process.exit(1);
  console.log(JSON.stringify({ result: { agent: observed } }));
}
`,
    { mode: 0o755 },
  );
  save();
  const command = (operation: string) =>
    Bun.spawn(
      [
        process.execPath,
        join(source, 'scripts/agent-waiting.ts'),
        operation,
        '--record',
        task,
        '--journal',
        journal,
        '--interval',
        '100',
        '--retry-ms',
        '1000',
      ],
      {
        cwd: root,
        env: { ...process.env, PATH: root + ':' + process.env.PATH },
        stdout: 'pipe',
        stderr: 'pipe',
      },
    );
  const start = () => {
    const child = command('watch');
    cleanup.push(async () => {
      child.kill('SIGTERM');
      await child.exited;
    });
    return child;
  };
  return {
    record,
    agents,
    read,
    save,
    queued,
    turns,
    calls,
    command,
    start,
    notify: (observed: Agent) =>
      writeFileSync(notification, JSON.stringify(observed)),
    interrupt: () => {
      interrupted = true;
    },
  };
}

test('consumer entry uses canonical delivery through dropped events, busy parking, interrupted send and restart', async () => {
  const f = await fixture();
  let child = f.start();
  await until(() => expect(f.read().status).toBe('armed'));
  const arming = f.command('status');
  expect(await arming.exited).toBe(0);
  expect(
    JSON.parse(await new Response(arming.stdout).text()).coordinator,
  ).toEqual(f.record.coordinator);
  const heartbeat = f.read().heartbeat;
  await until(() => expect(f.read().heartbeat).toBeGreaterThan(heartbeat));
  expect(f.queued).toEqual([]);
  expect(f.calls).not.toContain('thread/queue/add');
  expect(f.calls).not.toContain('thread/turns/list');

  f.agents[0].agent_status = 'working';
  f.record.state = 'active';
  f.agents[1].agent_status = 'done';
  f.agents[1].state_change_seq = 3;
  f.save();
  await until(() => expect(f.read().events).toHaveLength(1));
  expect(f.queued).toHaveLength(0);
  f.record.state = 'awaiting-workers';
  f.save();
  f.interrupt();
  f.agents[0].agent_status = 'idle';
  f.agents[0].state_change_seq++;
  f.save();
  await until(() => expect(f.read().status).toBe('failed'));
  const first = f.read();
  child.kill('SIGTERM');
  expect(await child.exited).toBe(0);
  expect(f.queued).toHaveLength(1);

  child = f.start();
  await until(() => expect(f.read().attempt?.submitted).toBe(true));
  expect(f.read().attempt.delivery).toBe(first.attempt.delivery);
  expect(f.read().events.map((e: any) => e.id)).toEqual(
    first.events.map((e: any) => e.id),
  );
  expect(f.queued).toHaveLength(1);
  expect(f.read().attempt.started).toBeUndefined();
  expect(f.read().events[0].handled).toBeUndefined();
  f.turns.push({
    id: 'observed-turn',
    startedAt: 100,
    items: [{ type: 'userMessage', clientId: first.attempt.delivery }],
  });
  await until(() => expect(f.read().attempt.turn).toBe('observed-turn'));
  f.record.handled.push({
    event: first.events[0].id,
    disposition: 'accepted; next action persisted',
  });
  f.save();
  await until(() => expect(f.read().events[0].handled).toContain('accepted'));
  // Replay the same lifecycle notification after acknowledgement. It cannot
  // create a new event or another native submission.
  f.notify(f.agents[1]);
  const acknowledgedHeartbeat = f.read().heartbeat;
  await until(() =>
    expect(f.read().heartbeat).toBeGreaterThan(acknowledgedHeartbeat),
  );
  expect(f.read().events).toHaveLength(1);
  expect(f.queued).toHaveLength(0);
  expect(f.calls.filter((m) => m === 'thread/queue/add')).toHaveLength(1);
  f.record.state = 'completed';
  f.save();
  expect(await child.exited).toBe(0);
  expect(f.read().status).toBe('completed');
});

test('consumer arming rejects a replaced Coordinator and reports removed/replaced workers with old identity', async () => {
  const f = await fixture(),
    child = f.start();
  await until(() => expect(f.read().status).toBe('armed'));
  const original = f.record.coordinator;
  f.record.coordinator = {
    session: original.session,
    pane: original.pane,
    kind: original.kind,
    name: original.name,
  };
  f.save();
  const heartbeat = f.read().heartbeat;
  await until(() => expect(f.read().heartbeat).toBeGreaterThan(heartbeat));
  const reordered = f.command('status');
  expect(await reordered.exited).toBe(0);
  f.record.coordinator.session = 'replacement';
  f.save();
  const status = f.command('status');
  expect(await status.exited).toBe(1);
  expect(await new Response(status.stderr).text()).toContain('not armed');
  f.record.coordinator.session = 'original-session';
  f.agents[0].agent_status = 'working';
  f.agents[1].agent_session!.value = 'replacement-worker';
  f.save();
  await until(() => expect(f.read().events[0]?.state).toBe('failed'));
  expect(f.read().events[0].worker.session).toBe('original-worker');
  f.agents.splice(1);
  f.save();
  f.record.state = 'completed';
  f.save();
  expect(await child.exited).toBe(0);
});

test('consumer retains an actionable failure when a registered worker disappears', async () => {
  const f = await fixture(),
    child = f.start();
  await until(() => expect(f.read().status).toBe('armed'));
  f.agents.splice(1);
  f.save();
  await until(() => expect(f.read().events[0]?.state).toBe('failed'));
  expect(f.read().events[0].worker).toEqual(f.record.workers[0]);
  await until(() => expect(f.queued).toHaveLength(1));
  f.record.state = 'completed';
  f.save();
  expect(await child.exited).toBe(0);
});

test('consumer fails unsupported continuation and missing authoritative identity without a delivery', async () => {
  for (const kind of ['opencode', 'claude', 'pi', 'goose']) {
    const f = await fixture();
    f.record.coordinator.kind = kind;
    f.agents[0].agent = kind;
    f.save();
    const child = f.start();
    expect(await child.exited).toBe(1);
    expect(await new Response(child.stderr).text()).toContain(
      'Unsupported continuation capability',
    );
    expect(f.queued).toHaveLength(0);
  }
  const f = await fixture();
  f.agents[0].agent_session = { kind: 'unknown', value: 'original-session' };
  f.save();
  const child = f.start();
  expect(await child.exited).toBe(1);
  expect(await new Response(child.stderr).text()).toContain(
    'native session changed',
  );
  expect(f.queued).toHaveLength(0);
});
