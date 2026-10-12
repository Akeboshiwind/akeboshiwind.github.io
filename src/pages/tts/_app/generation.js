export const RETRY_DELAYS = [1000, 2000, 4000];
export const CONCURRENCY_LIMIT = 3;

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Runs attempt() until it resolves, retrying once per entry in delays, and reports each
 * status change through update(patch). Resolves true when the chunk completed.
 */
export async function runChunk(attempt, update, { delays = RETRY_DELAYS, sleep = wait } = {}) {
  for (let retry = 0; ; retry++) {
    update({ status: 'generating' });
    try {
      const result = await attempt();
      update({ ...result, status: 'completed', error: null });
      return true;
    } catch (error) {
      if (retry >= delays.length) {
        update({ status: 'failed', error: error.message });
        return false;
      }
      update({ status: 'failed', error: error.message, retryCount: retry + 1 });
      await sleep(delays[retry]);
      update({ status: 'retrying' });
    }
  }
}

/** Calls worker on every item, at most limit at a time, in order of starting. */
export function runPool(items, limit, worker) {
  const queue = [...items];
  const lane = async () => {
    while (queue.length > 0) await worker(queue.shift());
  };
  return Promise.all(Array.from({ length: Math.min(limit, queue.length) }, lane));
}
