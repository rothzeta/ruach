import WebSocket from 'ws';
import { run } from './process';
import type { Continuation, Identity } from './waiting';

export class CodexContinuation implements Continuation {
  constructor(readonly cwd: string) {}

  private session(identity: Identity) {
    if (identity.kind !== 'codex' || !identity.session)
      throw new Error(
        'Unsupported continuation capability: requires an authoritative Codex native session',
      );
    return identity.session;
  }

  async check(identity: Identity) {
    const session = this.session(identity);
    await withCodex(this.cwd, (rpc) => checkCodex(rpc, session));
  }

  async wake(identity: Identity, text: string, delivery: string) {
    const session = this.session(identity);
    return withCodex(this.cwd, (rpc) =>
      queueWake(rpc, session, text, delivery),
    );
  }

  async receipt(identity: Identity, delivery: string) {
    const session = this.session(identity);
    return withCodex(this.cwd, (rpc) => queueReceipt(rpc, session, delivery));
  }

  async cancel(identity: Identity, delivery: string) {
    const session = this.session(identity);
    await withCodex(this.cwd, (rpc) => cancelQueued(rpc, session, delivery));
  }
}

export type Rpc = (method: string, params: unknown) => Promise<any>;
// Only connect to the existing, matching daemon. Never start/resume a thread or change settings.
export async function withCodex<T>(
  cwd: string,
  action: (rpc: Rpc) => Promise<T>,
): Promise<T> {
  const v = await run(['codex', 'app-server', 'daemon', 'version'], cwd);
  let info: any;
  try {
    info = JSON.parse(v.stdout);
  } catch {}
  if (
    v.exit !== 0 ||
    v.timedOut ||
    info?.status !== 'running' ||
    info.appServerVersion !== info.cliVersion ||
    typeof info.socketPath !== 'string' ||
    !info.socketPath.startsWith('/')
  )
    throw new Error(
      'Existing matching Codex daemon unavailable; external wake cannot be armed',
    );
  const socket = new WebSocket(`ws+unix://${info.socketPath}:/`);
  const pending = new Map<
    number,
    { resolve: (v: any) => void; reject: (e: Error) => void }
  >();
  let id = 0;
  const fail = () => {
    for (const p of pending.values())
      p.reject(new Error('Codex wake connection unavailable'));
    pending.clear();
  };
  socket.on('error', fail);
  socket.on('close', fail);
  socket.on('message', (bytes) => {
    let response: any;
    try {
      response = JSON.parse(bytes.toString());
    } catch {
      fail();
      return;
    }
    const p = pending.get(response.id);
    if (!p) return;
    pending.delete(response.id);
    if (response.error)
      p.reject(
        new Error(`Codex queue operation rejected (${response.error.code})`),
      );
    else p.resolve(response.result);
  });
  let deadline: ReturnType<typeof setTimeout>;
  const timeout = new Promise<never>((_, reject) => {
    deadline = setTimeout(() => {
      fail();
      socket.terminate();
      reject(new Error('Codex wake deadline exceeded'));
    }, 10000);
  });
  const rpc: Rpc = (method, params) =>
    new Promise((resolve, reject) => {
      const n = ++id;
      pending.set(n, { resolve, reject });
      socket.send(JSON.stringify({ id: n, method, params }), (error) => {
        if (error) {
          pending.delete(n);
          reject(error);
        }
      });
    });
  try {
    return await Promise.race([
      timeout,
      (async () => {
        await new Promise<void>((resolve, reject) => {
          socket.once('open', resolve);
          socket.once('error', reject);
          socket.once('close', () =>
            reject(new Error('Codex connection closed')),
          );
        });
        await rpc('initialize', {
          clientInfo: { name: 'ruach-external-wait', version: '1' },
          capabilities: { experimentalApi: true },
        });
        socket.send(JSON.stringify({ method: 'initialized' }));
        return action(rpc);
      })(),
    ]);
  } finally {
    clearTimeout(deadline!);
    socket.terminate();
  }
}

export async function checkCodex(rpc: Rpc, threadId: string) {
  const result = await rpc('thread/read', { threadId, includeTurns: false });
  if (result?.thread?.id !== threadId)
    throw new Error('Pinned Codex thread unavailable');
  // A CLI thread can live in another app-server process. The shared native queue is
  // consumed by its existing TUI; do not resume it into this daemon or call turn/start.
  await rpc('thread/queue/list', { threadId, limit: 1 });
}
async function queuedMessage(rpc: Rpc, threadId: string, deliveryId: string) {
  let cursor: string | null = null;
  do {
    const page: any = await rpc('thread/queue/list', {
      threadId,
      limit: 100,
      cursor,
    });
    const queued = page.data.find(
      (q: any) => q.clientUserMessageId === deliveryId,
    );
    if (queued) return queued;
    cursor = page.nextCursor;
  } while (cursor);
}
export async function queueReceipt(
  rpc: Rpc,
  threadId: string,
  deliveryId: string,
): Promise<{ queued: boolean; turn?: string }> {
  // Only the Coordinator's recent user-message correlation and turn start are needed.
  // Never inspect any worker history or treat a history message alone as activation.
  const page = await rpc('thread/turns/list', {
    threadId,
    limit: 20,
    itemsView: 'summary',
    sortDirection: 'desc',
  });
  const turn = page.data.find(
    (t: any) =>
      t.startedAt != null &&
      t.items.some(
        (i: any) => i.type === 'userMessage' && i.clientId === deliveryId,
      ),
  );
  return {
    queued: !!(await queuedMessage(rpc, threadId, deliveryId)),
    ...(turn ? { turn: turn.id } : {}),
  };
}
export async function queueWake(
  rpc: Rpc,
  threadId: string,
  text: string,
  deliveryId: string,
): Promise<{ submitted: boolean; turn?: string }> {
  await checkCodex(rpc, threadId);
  const receipt = await queueReceipt(rpc, threadId, deliveryId);
  if (receipt.turn || receipt.queued)
    return { submitted: true, turn: receipt.turn };
  const result = await rpc('thread/queue/add', {
    threadId,
    clientUserMessageId: deliveryId,
    input: [{ type: 'text', text, text_elements: [] }],
  });
  if (!result?.queuedSubmission?.id)
    throw new Error('Codex queue did not return a durable submission identity');
  // The existing TUI owns activation. Adding a queued follow-up never steers an active turn.
  return { submitted: true };
}
export async function cancelQueued(
  rpc: Rpc,
  threadId: string,
  deliveryId: string,
) {
  const queued = await queuedMessage(rpc, threadId, deliveryId);
  if (queued)
    await rpc('thread/queue/delete', {
      threadId,
      queuedSubmissionId: queued.id,
    });
}
