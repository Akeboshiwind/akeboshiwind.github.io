export const MAX_CHUNK_SIZE = 4000;

/** Splits on blank lines, then packs an over-long paragraph's sentences into chunks of at most MAX_CHUNK_SIZE. */
export function splitText(text) {
  const paragraphs = text.split(/\n\s*\n/).filter(p => p.trim());
  const chunks = [];

  for (const para of paragraphs) {
    const trimmed = para.trim();
    if (trimmed.length <= MAX_CHUNK_SIZE) {
      chunks.push(trimmed);
    } else {
      const sentences = trimmed.match(/[^.!?]+[.!?]+\s*/g) || [trimmed];
      let current = '';

      for (const sentence of sentences) {
        if ((current + sentence).length > MAX_CHUNK_SIZE) {
          if (current) chunks.push(current.trim());
          current = sentence;
        } else {
          current += sentence;
        }
      }
      if (current) chunks.push(current.trim());
    }
  }

  return chunks;
}

export function splitIntoChunks(text) {
  return splitText(text).map((text, id) => ({
    id,
    text,
    status: 'pending',
    audioBlob: null,
    audioUrl: null,
    duration: 0,
    retryCount: 0,
    error: null,
  }));
}
