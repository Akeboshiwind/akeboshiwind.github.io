/** Chunks play in order, so only the unbroken run of completed chunks from the start is playable. */
export function playableCount(chunks) {
  let count = 0;
  for (const chunk of chunks) {
    if (chunk.status !== 'completed') break;
    count++;
  }
  return count;
}

export function totalPlayableDuration(chunks) {
  let total = 0;
  for (const chunk of chunks) {
    if (chunk.status !== 'completed' || !chunk.duration) break;
    total += chunk.duration;
  }
  return total;
}

export function globalPosition(chunks, index, currentTime) {
  let position = 0;
  for (let i = 0; i < index; i++) {
    const chunk = chunks[i];
    if (chunk && chunk.duration) position += chunk.duration;
  }
  return position + (currentTime || 0);
}

/** The playable chunk holding globalTime and the offset into it, or null past the end. */
export function locate(chunks, globalTime) {
  let remaining = globalTime;
  const count = playableCount(chunks);
  for (let i = 0; i < count; i++) {
    const chunk = chunks[i];
    if (!chunk || !chunk.duration) continue;
    if (remaining <= chunk.duration) return { index: i, offset: remaining };
    remaining -= chunk.duration;
  }
  return null;
}

export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
