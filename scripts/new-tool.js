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

// hooks.js — generic useLocalStorage
writeFileSync(join(appDir, 'hooks.js'), `import { useState, useEffect } from 'react';

export const useLocalStorage = (key, initialValue, { prefix = '' } = {}) => {
  const fullKey = prefix + key;
  const [value, setValue] = useState(() => {
    try {
      const item = localStorage.getItem(fullKey);
      return item !== null ? JSON.parse(item) : initialValue;
    } catch { return initialValue; }
  });
  useEffect(() => {
    try { localStorage.setItem(fullKey, JSON.stringify(value)); }
    catch { /* quota exceeded */ }
  }, [value, fullKey]);
  return [value, setValue];
};
`);

// app.jsx
writeFileSync(join(appDir, 'app.jsx'), `import { createRoot } from 'react-dom/client';
import { useLocalStorage } from './hooks.js';

const PREFIX = '${slug}_';

function App() {
  const [count, setCount] = useLocalStorage('count', 0, { prefix: PREFIX });

  return (
    <div className="flex flex-col h-screen p-4 gap-3 text-gray-900 dark:text-gray-100">
      <a href="../" className="inline-flex items-center gap-1 text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
        ← Home
      </a>
      <h1 className="text-xl font-semibold">${title}</h1>
      <p>Count: {count}</p>
      <button onClick={() => setCount(c => c + 1)} className="px-3 py-1 rounded bg-blue-500 text-white w-fit">+1</button>
    </div>
  );
}

createRoot(document.getElementById('app')).render(<App />);
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
console.log(`  ${join(appDir, 'hooks.js')}`);
console.log(`  ${worksFile}`);
console.log();
console.log(`Don't forget:`);
console.log(`  - Add a screenshot at src/assets/works/${slug}.png`);
console.log(`  - Fill in the description in ${worksFile}`);
console.log(`  - Study 2-3 existing React apps for patterns (NOT bitemporal/christmas/chat-wrapped)`);
