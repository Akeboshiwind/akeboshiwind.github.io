import { describe, test, expect, vi } from 'vitest';
import { runChunk, runPool, RETRY_DELAYS } from './generation.js';

const statuses = (update) => update.mock.calls.map(([patch]) => patch.status);

describe('runChunk', () => {
  test('a first-time success goes generating then completed, with the result', async () => {
    const update = vi.fn();
    const ok = await runChunk(async () => ({ audioUrl: 'blob:a', duration: 4 }), update);
    expect(ok).toBe(true);
    expect(statuses(update)).toEqual(['generating', 'completed']);
    expect(update).toHaveBeenLastCalledWith({ audioUrl: 'blob:a', duration: 4, status: 'completed', error: null });
  });

  test('retries after 1s, 2s and 4s, then fails for good with the last error', async () => {
    const update = vi.fn();
    const sleep = vi.fn(async () => {});
    const attempt = vi.fn(async () => { throw new Error('API error 500: boom'); });
    const ok = await runChunk(attempt, update, { sleep });
    expect(ok).toBe(false);
    expect(attempt).toHaveBeenCalledTimes(4);
    expect(sleep.mock.calls.map(([ms]) => ms)).toEqual(RETRY_DELAYS);
    expect(RETRY_DELAYS).toEqual([1000, 2000, 4000]);
    expect(statuses(update)).toEqual([
      'generating', 'failed', 'retrying',
      'generating', 'failed', 'retrying',
      'generating', 'failed', 'retrying',
      'generating', 'failed',
    ]);
    expect(update).toHaveBeenLastCalledWith({ status: 'failed', error: 'API error 500: boom' });
  });

  test('a retry that succeeds completes', async () => {
    const update = vi.fn();
    let calls = 0;
    const attempt = async () => { if (calls++ === 0) throw new Error('flaky'); return { duration: 1 }; };
    expect(await runChunk(attempt, update, { sleep: async () => {} })).toBe(true);
    expect(statuses(update)).toEqual(['generating', 'failed', 'retrying', 'generating', 'completed']);
  });
});

describe('runPool', () => {
  test('runs every item, never more than the limit at once', async () => {
    let active = 0;
    let peak = 0;
    const seen = [];
    await runPool([1, 2, 3, 4, 5], 3, async (n) => {
      active++;
      peak = Math.max(peak, active);
      await new Promise((r) => setTimeout(r, 1));
      seen.push(n);
      active--;
    });
    expect(peak).toBe(3);
    expect(seen.sort()).toEqual([1, 2, 3, 4, 5]);
  });
});
