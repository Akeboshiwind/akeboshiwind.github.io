import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const PALETTE = 'slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose';
const RAW_COLOUR = new RegExp(
  [
    `\\b(?:bg|text|border|ring|from|via|to|fill|stroke|divide|outline|decoration|placeholder|shadow|caret|accent)-(?:${PALETTE})-\\d{2,3}\\b`,
    '\\b(?:bg|text|border|ring|fill|stroke)-(?:white|black)\\b',
    '\\bdark:(?=[\\w[-])',
    '#(?:[0-9a-fA-F]{8}|[0-9a-fA-F]{6}|[0-9a-fA-F]{3})\\b',
  ].join('|'),
  'g',
);

const files = (dir) => readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
  const path = join(dir, entry.name);
  if (entry.isDirectory()) return files(path);
  return /\.(astro|jsx?|css)$/.test(entry.name) && !/\.test\./.test(entry.name) ? [path] : [];
});

const pixelPages = readdirSync('src/pages', { withFileTypes: true })
  .filter((entry) => entry.isDirectory())
  .map((entry) => join('src/pages', entry.name))
  .filter((dir) => existsSync(join(dir, 'index.astro')) && readFileSync(join(dir, 'index.astro'), 'utf8').includes('PixelAppLayout'));

describe('a page on PixelAppLayout takes its colours from the theme', () => {
  test.each(pixelPages)('%s', (dir) => {
    const found = files(dir).flatMap((path) =>
      [...readFileSync(path, 'utf8').matchAll(RAW_COLOUR)].map(([match]) => `${path}: ${match}`));
    expect(found).toEqual([]);
  });
});
