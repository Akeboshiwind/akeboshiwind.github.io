#!/usr/bin/env node

import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const [slug, title] = process.argv.slice(2);

if (!slug || !title) {
  console.error('Usage: npm run new-tool <slug> "<Title>"');
  console.error('Example: npm run new-tool unit-converter "Unit Converter"');
  process.exit(1);
}

const pageDir = join('src/pages', slug);
const appDir = join(pageDir, '_app');
const worksFile = join('src/content/works', `${slug}.json`);

if (existsSync(pageDir)) {
  console.error(`Error: ${pageDir} already exists`);
  process.exit(1);
}

mkdirSync(appDir, { recursive: true });

// index.astro
writeFileSync(join(pageDir, 'index.astro'), `---
import PixelAppLayout from '../../layouts/PixelAppLayout.astro';
---
<PixelAppLayout title="${title}">
  <script>import './_app/app.jsx';</script>
</PixelAppLayout>
`);

// app.jsx
writeFileSync(join(appDir, 'app.jsx'), `import { createRoot } from 'react-dom/client';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';
import { SectionLabel } from '../../../components/pixel/SectionLabel.jsx';

const PREFIX = '${slug}_';

export function App() {
  const [count, setCount] = useLocalStorage('count', 0, { prefix: PREFIX });

  return (
    <main className="flex flex-col gap-2">
      <h1 className="page-title">${title}</h1>
      {/* Replace this placeholder with your app, drawn from the classes and components on /kit/ */}
      <SectionLabel className="mt-6">Count</SectionLabel>
      <p className="font-pixel text-pixel-lg text-heading">{count}</p>
      <button onClick={() => setCount(c => c + 1)} className="pixel-button w-fit" data-variant="primary">+1</button>
    </main>
  );
}

const mount = document.getElementById('app');
if (mount) createRoot(mount).render(<App />);
`);

// app.test.jsx — smoke test
writeFileSync(join(appDir, 'app.test.jsx'), `import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import { render, screen, cleanup } from '@testing-library/react';
import { App } from './app.jsx';

afterEach(cleanup);

describe('${title}', () => {
  beforeEach(() => { localStorage.clear(); });

  test('renders without crashing', () => {
    render(<App />);
    expect(screen.getByText('${title}')).toBeTruthy();
  });
});
`);

// works entry
const today = new Date().toISOString().slice(0, 10);
writeFileSync(worksFile, JSON.stringify({
  title,
  stage: 'scribble',
  published: today,
  description: '',
  tags: [],
  category: 'utilities',
  icon: 'wrench',
  dither: 'ui',
}, null, 2) + '\n');

console.log(`Created:`);
console.log(`  ${join(pageDir, 'index.astro')}`);
console.log(`  ${join(appDir, 'app.jsx')}`);
console.log(`  ${join(appDir, 'app.test.jsx')}`);
console.log(`  ${worksFile}`);
console.log();
console.log(`Don't forget:`);
console.log(`  - Add a screenshot at src/assets/works/${slug}.png`);
console.log(`  - Fill in the description in ${worksFile}`);
console.log(`  - Pick a category + icon in ${worksFile} (defaults: utilities / wrench)`);
console.log(`    categories: finance, health, ai, images, utilities, fun, learning, talks, personal`);
console.log(`    icon: a pixelarticons name (https://pixelarticons.com/), or a lucide name aliased in Icon.astro`);
console.log(`  - Set dither in ${worksFile} once the screenshot exists (default: ui)`);
console.log(`    ui: app UI (panels, text, buttons); image: mainly a picture, photo or illustration`);
console.log(`  - Build the UI from the classes and components on /kit/; Bill Splitter and TapBlok show them in use`);
console.log(`  - Run \`npm test\` to verify everything still passes`);
