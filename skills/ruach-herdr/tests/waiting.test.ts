import { afterEach, expect, test } from 'bun:test';
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { HerdrTransport, Watcher, type Agent, type Identity, type Transport, type WaitRecord } from '../scripts/waiting';
const roots: string[] = [];
afterEach(() => { for (const root of roots.splice(0)) rmSync(root, { recursive: true, force: true }); });
function fixture() {
  const root = mkdtempSync(join(tmpdir(), 'ruach-wait-')); roots.push(root);
  const coordinator = { name: 'coord', kind: 'codex', pane: 'w1:p1', session: 'native-coord' };
  const worker = { name: 'impl', kind: 'codex', pane: 'w2:p1', session: 'native-impl', assignment: 'impl-1', after_seq: 10, handoff: 'reports/impl.md' };
  const record: WaitRecord = { workflow: 'task-1', generation: 'run-1', state: 'awaiting-workers', coordinator, workers: [worker], handled: [] };
  const agent = (id: Identity, state: string, seq: number): Agent => ({ name: id.name, agent: id.kind, pane_id: id.pane, agent_session: { kind: 'id', value: id.session }, agent_status: state, state_change_seq: seq });
  const agents = [agent(coordinator, 'idle', 20), agent(worker, 'working', 11)];
  const deliveries: { identity: Identity; text: string }[] = [];
  let succeeds = true;
  const path = join(root, 'task.md'), journal = join(root, 'events.json');
  const write = () => writeFileSync(path, `# Durable task record\n\n\`\`\`ruach-wait\n${JSON.stringify(record)}\n\`\`\`\n`);
  const transport: Transport = { list: async () => structuredClone(agents), wake: async (identity, text) => {
    // The queue must already exist durably at the transport boundary.
    expect(JSON.parse(readFileSync(journal, 'utf8')).events.length).toBeGreaterThan(0);
    deliveries.push({ identity, text }); return { submitted: succeeds, ...(succeeds ? { turn: 'turn-started' } : {}) };
  } };
  write();
  return { root, record, path, journal, agents, deliveries, write, transport, fail: () => { succeeds = false; }, watcher: () => new Watcher(path, journal, transport, 1000) };
}
test('healthy waiting is quiet: no wake submissions or model turns across controllable time', async () => {
  const f = fixture(), watcher = f.watcher();
  for (let now = 0; now < 100000; now += 500) expect((await watcher.step(now)).status).toBe('armed');
  expect(f.deliveries).toEqual([]);
  expect(readFileSync(f.path, 'utf8')).toContain('awaiting-workers');
});
test('dropped lifecycle notification recovers through status; delivery pins the existing named native session', async () => {
  const f = fixture(); await f.watcher().step(0);
  f.agents[1].agent_status = 'done'; f.agents[1].state_change_seq = 12;
  const j = await f.watcher().step(1); // No notification was supplied.
  expect(j.events).toHaveLength(1); expect(f.deliveries).toHaveLength(1);
  expect(f.deliveries[0].identity).toEqual(f.record.coordinator);
  expect(j.attempt?.started).toBe(1);
  expect(j.events[0].handled).toBeUndefined(); // Submission/activation is not handling.
});
test('restart and duplicate delivery preserve event identity; only record dispositions acknowledge handling', async () => {
  const f = fixture(); f.agents[1].agent_status = 'blocked'; f.agents[1].state_change_seq = 13;
  const first = await f.watcher().step(0), id = first.events[0].id;
  const second = await f.watcher().step(1001);
  expect(second.events.map(e => e.id)).toEqual([id]); expect(f.deliveries).toHaveLength(2);
  f.record.handled.push({ event: id, disposition: 'blocker recorded; fix assignment FIX-1 already sent' }); f.write();
  const last = await f.watcher().step(5000);
  expect(last.events[0].handled).toContain('FIX-1'); expect(f.deliveries).toHaveLength(2);
});
test('events arriving while busy are durable and batched after parking; an active turn is never repeatedly woken', async () => {
  const f = fixture(); f.agents[0].agent_status = 'working'; f.record.state = 'active'; f.write();
  f.agents[1].agent_status = 'done'; f.agents[1].state_change_seq = 14;
  await f.watcher().step(0); expect(f.deliveries).toHaveLength(0);
  f.record.state = 'awaiting-workers'; f.write();
  await f.watcher().step(5000); expect(f.deliveries).toHaveLength(0);
  f.agents[0].agent_status = 'idle'; f.agents[0].state_change_seq = 21;
  await f.watcher().step(6000); expect(f.deliveries).toHaveLength(1);
  f.agents[0].agent_status = 'working'; f.agents[0].state_change_seq = 22;
  await f.watcher().step(99999); expect(f.deliveries).toHaveLength(1);
});
test('completion during transition into parking is reconciled; events from earlier idle baseline are ignored', async () => {
  const f = fixture(); f.agents[1].agent_status = 'idle'; f.agents[1].state_change_seq = 10;
  f.record.state = 'active'; f.write(); await f.watcher().step(0);
  expect(f.deliveries).toHaveLength(0);
  f.agents[1].state_change_seq = 15; await f.watcher().step(1);
  f.record.state = 'awaiting-workers'; f.write(); await f.watcher().step(2);
  expect(f.deliveries).toHaveLength(1);
});
test('uncertain send is retained across restart; fresh working observation defers retry until settled', async () => {
  const f = fixture(); f.fail(); f.agents[1].agent_status = 'done'; f.agents[1].state_change_seq = 16;
  const first = await f.watcher().step(0); expect(first.attempt?.started).toBeUndefined();
  f.agents[0].agent_status = 'working'; f.agents[0].state_change_seq = 21;
  f.transport.receipt = async () => ({ queued: false, turn: 'actual-correlated-turn' });
  expect((await f.watcher().step(3000)).attempt?.started).toBe(3000);
  await f.watcher().step(9000); expect(f.deliveries).toHaveLength(1);
  f.agents[0].agent_status = 'idle'; f.agents[0].state_change_seq = 22;
  await f.watcher().step(10000); expect(f.deliveries).toHaveLength(2);
});
test('parked is recoverable and explicitly completed stops without probing or releasing resources', async () => {
  const f = fixture(); expect((await f.watcher().step(0)).status).toBe('armed');
  f.record.state = 'completed'; f.write(); f.transport.list = async () => { throw new Error('must not inspect after completion'); };
  expect((await f.watcher().step(1)).status).toBe('completed'); expect(f.deliveries).toHaveLength(0);
});
test('unusable wake path and replacement session are operational failures, never fresh launches', async () => {
  const f = fixture(); f.agents[0].agent_session!.value = 'replacement';
  await expect(f.watcher().step(0)).rejects.toThrow('native session changed');
  expect(JSON.parse(readFileSync(f.journal, 'utf8')).status).toBe('failed'); expect(f.deliveries).toHaveLength(0);
});
test('unhandled delivery exhausts bounded retries with events retained', async () => {
  const f = fixture(); f.agents[1].agent_status = 'done'; f.agents[1].state_change_seq = 17;
  for (const now of [0, 1001, 2002]) await f.watcher().step(now);
  await expect(f.watcher().step(3003)).rejects.toThrow('operator recovery');
  expect(f.deliveries).toHaveLength(3); expect(JSON.parse(readFileSync(f.journal, 'utf8')).events[0].handled).toBeUndefined();
});
test('multiple related completions batch once, and removed workers do not discard unhandled events', async () => {
  const f = fixture();
  const w2 = { ...f.record.workers[0], name: 'review', assignment: 'review-1', pane: 'w3:p1', session: 'native-review' };
  f.record.workers.push(w2); f.write();
  f.agents[1].agent_status = 'done'; f.agents[1].state_change_seq = 18;
  f.agents.push({ ...f.agents[1], name: w2.name, pane_id: w2.pane, agent_session: { kind: 'id', value: w2.session }, state_change_seq: 19 });
  const result = await f.watcher().step(0);
  expect(result.events).toHaveLength(2); expect(f.deliveries).toHaveLength(1);
  f.record.workers.splice(0); f.write();
  expect((await f.watcher().step(1001)).events.filter(e => !e.handled)).toHaveLength(2);
});
test('worker replacement emits an actionable failure with pinned old identity instead of accepting the replacement', async () => {
  const f = fixture(); f.agents[1].agent_session!.value = 'replacement';
  const result = await f.watcher().step(0);
  expect(result.events[0].state).toBe('failed'); expect(result.events[0].worker.session).toBe('native-impl');
});
test('new watcher reconstructs the same event identity from lifecycle status after losing only its operational journal', async () => {
  const f = fixture(); f.agents[1].agent_status = 'done'; f.agents[1].state_change_seq = 20;
  const first = await f.watcher().step(0);
  rmSync(f.journal);
  f.record.handled.push({ event: first.events[0].id, disposition: 'already accepted once' }); f.write();
  const second = await f.watcher().step(1001);
  expect(second.events[0].id).toBe(first.events[0].id); expect(second.events[0].handled).toBe('already accepted once');
  expect(f.deliveries).toHaveLength(1);
});
test('a received transient blocker is durable even when current status has already recovered, including across restart', async () => {
  const f = fixture(); await f.watcher().step(0);
  const blocked = { ...structuredClone(f.agents[1]), agent_status: 'blocked', state_change_seq: 12 };
  f.watcher().capture(blocked, 1);
  f.agents[1].agent_status = 'working'; f.agents[1].state_change_seq = 13;
  const next = await f.watcher().step(2);
  expect(next.events.map(e => e.state)).toEqual(['blocked']);
  expect(f.deliveries).toHaveLength(1); expect(f.deliveries[0].text).toContain('blocked');
});
test('notification transport retains both its initial actionable snapshot and a later received blocker', async () => {
  const f = fixture(); await f.watcher().step(0);
  const exe = join(f.root, 'herdr');
  const initial = { ...f.agents[1], agent_status: 'done', state_change_seq: 12 };
  const observed = { ...f.agents[1], agent_status: 'blocked', state_change_seq: 14 };
  writeFileSync(exe, `#!/usr/bin/env bun\nconsole.log(JSON.stringify({result:process.argv[3]==='list'?{agents:${JSON.stringify([f.agents[0], initial])}}:{agent:${JSON.stringify(observed)}}}));\n`, { mode: 0o755 });
  await new HerdrTransport(f.root, exe).notification(f.record.workers, 100, a => f.watcher().capture(a, 1));
  f.agents[1].agent_status = 'working'; f.agents[1].state_change_seq = 15;
  const result = await f.watcher().step(2);
  expect(result.events.map(e => e.state)).toEqual(['done', 'blocked']); expect(f.deliveries).toHaveLength(1);
});
test('an uncertain queued batch keeps its payload identity when another worker finishes', async () => {
  const f = fixture(); f.transport.wake = async (identity, text) => { f.deliveries.push({ identity, text }); return { submitted: true }; };
  const w2 = { ...f.record.workers[0], name: 'second', assignment: 'impl-2', pane: 'w3:p1', session: 'native-second' };
  f.record.workers.push(w2); f.write();
  f.agents.push({ ...f.agents[1], name: w2.name, pane_id: w2.pane, agent_session: { kind: 'id', value: w2.session } });
  f.agents[1].agent_status = 'done'; f.agents[1].state_change_seq = 16;
  const first = await f.watcher().step(0);
  f.agents[2].agent_status = 'done'; f.agents[2].state_change_seq = 17;
  const second = await f.watcher().step(1001);
  expect(second.attempt?.delivery).toBe(first.attempt?.delivery);
  expect(second.attempt?.ids).toEqual(first.attempt?.ids);
  expect(f.deliveries[1].text).not.toContain('impl-2');
  f.record.handled.push({ event: first.events[0].id, disposition: 'accepted first once' }); f.write();
  await f.watcher().step(2002);
  expect(f.deliveries[2].text).toContain('impl-2'); expect(f.deliveries[2].text).not.toContain('impl-1');
});
test('malformed Coordinator disposition is an operational failure with the original event retained', async () => {
  const f = fixture(); f.agents[1].agent_status = 'done'; f.agents[1].state_change_seq = 18;
  const first = await f.watcher().step(0);
  (f.record.handled as any[]).push({ id: first.events[0].id, disposition: 'wrong field' }); f.write();
  await expect(f.watcher().step(1)).rejects.toThrow('Invalid waiting record');
  const failed = JSON.parse(readFileSync(f.journal, 'utf8'));
  expect(failed.status).toBe('failed'); expect(failed.events).toHaveLength(1);
});
