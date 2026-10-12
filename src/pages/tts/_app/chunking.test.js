import { describe, test, expect } from 'vitest';
import { MAX_CHUNK_SIZE, splitText, splitIntoChunks } from './chunking.js';

describe('splitText', () => {
  test('empty or blank text makes no chunks', () => {
    expect(splitText('')).toEqual([]);
    expect(splitText('  \n\n \n')).toEqual([]);
  });

  test('each paragraph is a chunk, trimmed, and a single newline does not split', () => {
    expect(splitText('  One.\nStill one.  \n\n\nTwo.\n  \nThree.')).toEqual(['One.\nStill one.', 'Two.', 'Three.']);
  });

  test('a paragraph of exactly MAX_CHUNK_SIZE stays whole', () => {
    const para = 'a'.repeat(MAX_CHUNK_SIZE);
    expect(splitText(para)).toEqual([para]);
  });

  test('a longer paragraph is packed by sentence into chunks no longer than MAX_CHUNK_SIZE', () => {
    const sentence = 'x'.repeat(999) + '. ';
    const para = sentence.repeat(9).trim();
    const chunks = splitText(para);
    expect(chunks).toHaveLength(3);
    expect(chunks.every((c) => c.length <= MAX_CHUNK_SIZE)).toBe(true);
    expect(chunks.join(' ')).toBe(para);
  });

  test('a long paragraph with no sentence ending stays one chunk', () => {
    const para = 'y'.repeat(MAX_CHUNK_SIZE + 10);
    expect(splitText(para)).toEqual([para]);
  });
});

describe('splitIntoChunks', () => {
  test('numbers the chunks from 0 and starts them pending with no audio', () => {
    expect(splitIntoChunks('A.\n\nB.')).toEqual([
      { id: 0, text: 'A.', status: 'pending', audioBlob: null, audioUrl: null, duration: 0, retryCount: 0, error: null },
      { id: 1, text: 'B.', status: 'pending', audioBlob: null, audioUrl: null, duration: 0, retryCount: 0, error: null },
    ]);
  });
});
