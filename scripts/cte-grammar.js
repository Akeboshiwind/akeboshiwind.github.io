#!/usr/bin/env node
// Regenerates src/lib/cte/xtdb-sql/ from XTDB's SQL grammar at a given commit:
//   npm run cte-grammar -- <xtdb commit sha>
// Needs Java on the PATH; the output is committed, so building the site does not.

import { execFileSync } from 'node:child_process';
import { copyFileSync, mkdirSync, mkdtempSync, readdirSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';

const [REF] = process.argv.slice(2);
if (!/^[0-9a-f]{40}$/.test(REF ?? '')) {
  console.error('Usage: npm run cte-grammar -- <full xtdb commit sha>');
  process.exit(1);
}
const REPO = `https://raw.githubusercontent.com/xtdb/xtdb/${REF}`;
const GRAMMAR = 'core/src/main/antlr/xtdb/antlr';
const OUT = 'src/lib/cte/xtdb-sql';
const FILES = ['SqlLexer.g4', 'Sql.g4'];
const PATCHES = readdirSync(join(OUT, 'patches')).filter((f) => f.endsWith('.patch')).sort();

const fetchText = async (path) => {
  const res = await fetch(`${REPO}/${path}`);
  if (!res.ok) throw new Error(`${path}: HTTP ${res.status}`);
  return res.text();
};

for (const file of FILES) {
  writeFileSync(join(OUT, file), await fetchText(`${GRAMMAR}/${file}`));
}
writeFileSync(join(OUT, 'LICENSE'), await fetchText('LICENSE'));
writeFileSync(join(OUT, 'README.md'), `# XTDB SQL grammar

\`Sql.g4\` and \`SqlLexer.g4\` are [XTDB](https://github.com/xtdb/xtdb)'s SQL grammar at commit \`${REF}\`, unchanged,
from [\`${GRAMMAR}\`](https://github.com/xtdb/xtdb/tree/${REF}/${GRAMMAR}).
They, the patches to them in \`patches/\`, and the parser ANTLR generates here are under the Mozilla Public License 2.0 (\`LICENSE\`).

\`npm run cte-grammar -- ${REF}\` (\`scripts/cte-grammar.js\`) fetches the grammar and generates \`Sql.ts\` and \`SqlLexer.ts\`
from it with these patches applied, in order; each says at its top what it changes and why:

${PATCHES.map((p) => `- \`patches/${p}\``).join('\n')}

Change the patches, not the generated files.
`);

// ANTLR writes the grammar's path into each generated file's header, so the patched copy sits at the same relative path.
const work = mkdtempSync(join(tmpdir(), 'cte-grammar-'));
try {
  const patched = join(work, OUT);
  mkdirSync(patched, { recursive: true });
  for (const file of FILES) copyFileSync(join(OUT, file), join(patched, file));
  for (const p of PATCHES) {
    execFileSync('patch', ['-p1', '-F0', '-s', '-d', patched, '-i', resolve(OUT, 'patches', p)], { stdio: 'inherit' });
  }
  execFileSync(resolve('node_modules/.bin/antlr4ng'), [
    '-no-listener', '-no-visitor', '-Xexact-output-dir',
    '-o', resolve(OUT), ...FILES.map((file) => join(OUT, file)),
  ], { cwd: work, stdio: 'inherit' });
} finally {
  rmSync(work, { recursive: true, force: true });
}

for (const f of readdirSync(OUT)) {
  if (f.endsWith('.interp') || f.endsWith('.tokens')) rmSync(join(OUT, f));
}
