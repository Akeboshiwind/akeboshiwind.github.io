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
import AppLayout from '../../layouts/AppLayout.astro';
---
<AppLayout title="${title}">
  <script>import './_app/app.jsx';</script>
</AppLayout>
`);

// app.jsx
writeFileSync(join(appDir, 'app.jsx'), `import { createRoot } from 'react-dom/client';
import { useLocalStorage } from '../../../lib/useLocalStorage.js';

const PREFIX = '${slug}_';

export function App() {
  const [count, setCount] = useLocalStorage('count', 0, { prefix: PREFIX });

  return (
    <div className="flex flex-col h-screen p-4 gap-3 text-gray-900 dark:text-gray-100">
      <a href="../" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
        ← Home
      </a>
      <h1 className="text-xl font-semibold">${title}</h1>
      {/* Replace this placeholder with your app */}
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)} className="px-3 py-1 rounded bg-blue-500 text-white w-fit">+1</button>
    </div>
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

  test('has a home link', () => {
    render(<App />);
    const home = screen.getByText('← Home').closest('a');
    expect(home.getAttribute('href')).toBe('../');
  });
});
`);

// works entry
const today = new Date().toISOString().slice(0, 10);
writeFileSync(worksFile, JSON.stringify({
  title,
  stage: 'scribble',
  date: today,
  description: '',
  tags: ['tool'],
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
console.log(`  - Study 2-3 existing React apps for patterns (NOT bitemporal/christmas/chat-wrapped)`);
console.log(`  - Run \`npm test\` to verify everything still passes`);
