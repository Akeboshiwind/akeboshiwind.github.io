import { describe, test, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';

const read = (path) => readFileSync(path, 'utf8');
const components = readdirSync('src/components/pixel');
const kitPage = read('src/pages/kit/index.astro');
const kitClasses = [...new Set(read('src/styles/theme.css').match(/(?<=\.)(?:pixel|section)-[a-z-]+/g))];

describe('the /kit/ page', () => {
  test.each(components.filter((f) => f.endsWith('.astro')))('imports %s', (file) => {
    expect(kitPage).toContain(`components/pixel/${file}`);
  });

  test.each(kitClasses)('shows .%s', (name) => {
    expect(kitPage).toMatch(new RegExp(`\\b${name}\\b`));
  });
});

describe('components/pixel', () => {
  test.each(components.filter((f) => f.endsWith('.jsx')))('%s has an .astro twin', (file) => {
    expect(components).toContain(file.replace(/\.jsx$/, '.astro'));
  });
});
