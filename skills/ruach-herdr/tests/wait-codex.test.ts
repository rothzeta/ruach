import { expect, test } from 'bun:test';
import { cancelQueued, checkCodex, queueReceipt, queueWake, type Rpc } from '../scripts/wait-codex';

// A controllable native protocol boundary. These tests assert public queue effects;
// the retained live smoke separately establishes real Codex/TUI queue consumption.
function native() {
  const calls: string[] = [], queued: any[] = [], turns: any[] = [];
  let loseReply = false;
  const rpc: Rpc = async (method, p: any) => {
    calls.push(method);
    if (method === 'thread/read') return { thread: { id: 'same-native', status: { type: 'notLoaded' } } };
    if (method === 'thread/queue/list') return { data: [...queued], nextCursor: null };
    if (method === 'thread/turns/list') return { data: [...turns], nextCursor: null };
    if (method === 'thread/queue/add') {
      const item = { id: 'queued-1', clientUserMessageId: p.clientUserMessageId, input: p.input }; queued.push(item);
      if (loseReply) throw new Error('connection lost after durable addition');
      return { queuedSubmission: item };
    }
    if (method === 'thread/queue/delete') { queued.splice(queued.findIndex(q => q.id === p.queuedSubmissionId), 1); return { deleted: true }; }
    throw new Error(`Forbidden native operation: ${method}`);
  };
  return { rpc, calls, queued, turns, dropReply: () => { loseReply = true; } };
}
test('native queue preserves the existing thread without resume, direct turn input, steering or setting changes', async () => {
  const n = native(); await checkCodex(n.rpc, 'same-native');
  const r = await queueWake(n.rpc, 'same-native', 'event batch', 'delivery-1');
  expect(r).toEqual({ submitted: true }); expect(n.queued).toHaveLength(1);
  expect(n.queued[0].clientUserMessageId).toBe('delivery-1');
  expect(n.calls.every(m => ['thread/read', 'thread/queue/list', 'thread/turns/list', 'thread/queue/add'].includes(m))).toBe(true);
});
test('lost native add reply plus watcher restart reuses durable queue entry rather than adding another', async () => {
  const n = native(); n.dropReply();
  await expect(queueWake(n.rpc, 'same-native', 'events', 'stable-delivery')).rejects.toThrow('connection lost');
  expect(await queueWake(n.rpc, 'same-native', 'events', 'stable-delivery')).toEqual({ submitted: true, turn: undefined });
  expect(n.queued).toHaveLength(1);
});
test('submission, history receipt, and actual native turn activation are distinct evidence', async () => {
  const n = native(); await queueWake(n.rpc, 'same-native', 'events', 'delivery-2');
  n.turns.push({ id: 'not-started', startedAt: null, items: [{ type: 'userMessage', clientId: 'delivery-2' }] });
  expect(await queueReceipt(n.rpc, 'same-native', 'delivery-2')).toEqual({ queued: true });
  n.queued.splice(0); n.turns.splice(0);
  n.turns.push({ id: 'actual-turn', startedAt: 100, items: [{ type: 'userMessage', clientId: 'delivery-2' }] });
  expect(await queueReceipt(n.rpc, 'same-native', 'delivery-2')).toEqual({ queued: false, turn: 'actual-turn' });
  await queueWake(n.rpc, 'same-native', 'events', 'delivery-2'); expect(n.queued).toHaveLength(0);
});
test('durably handled batches cancel only their own still-queued submission', async () => {
  const n = native(); await queueWake(n.rpc, 'same-native', 'events', 'owned');
  n.queued.push({ id: 'unrelated', clientUserMessageId: 'user-message', input: [] });
  await cancelQueued(n.rpc, 'same-native', 'owned');
  expect(n.queued.map(q => q.id)).toEqual(['unrelated']);
});
