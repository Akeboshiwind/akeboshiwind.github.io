#!/usr/bin/env node

import { spawnSync } from 'child_process';
import { mkdirSync } from 'fs';
import { createServer } from 'net';
import { tmpdir } from 'os';
import { join, resolve } from 'path';
import { fileURLToPath, pathToFileURL } from 'url';
import { parseArgs } from 'util';

const THEMES = ['light', 'dark'];
const USAGE = 'Usage: npm run shot -- <path>... [--theme light,dark] [--width 390,1280] [--out <dir>] [--steps <file>] [--touch]';

/**
 * Turns CLI paths and options into the screenshots to take.
 * `theme` and `width` are comma-separated lists, as typed on the command line.
 * `tmp` is the parent of the `shots/` directory used when `out` is absent.
 * Returns `{ dir, shots }`, each shot being `{ path, theme, width, file }`.
 * Throws on a missing path, an unknown theme or a width that is not a positive integer.
 */
export function planShots(paths, { tmp, out, theme = 'light,dark', width = '390,1280' }) {
  if (paths.length === 0) throw new Error(`Give at least one path to shoot.\n${USAGE}`);

  const themes = theme.split(',');
  const unknown = themes.find((t) => !THEMES.includes(t));
  if (unknown) throw new Error(`Unknown theme "${unknown}"; use ${THEMES.join(' or ')}.`);

  const widths = width.split(',').map((w) => {
    if (!/^[1-9]\d*$/.test(w)) throw new Error(`Width "${w}" is not a positive integer.`);
    return Number(w);
  });

  const dir = out ?? join(tmp, 'shots');
  const shots = paths.flatMap((path) => {
    const name = path.replace(/^\/+|\/+$/g, '').replaceAll('/', '-') || 'home';
    return themes.flatMap((t) => widths.map((w) => ({
      path, theme: t, width: w, file: join(dir, `${name}-${t}-${w}.png`),
    })));
  });
  return { dir, shots };
}

/** The Playwright browser context a shot is taken in; `touch` emulates a phone, which `tap()` needs. */
export function contextOptions({ theme, width, touch = false }) {
  return { viewport: { width, height: 900 }, colorScheme: theme, ...(touch && { hasTouch: true, isMobile: true }) };
}

/**
 * The steps that put a page into the state to shoot: the default export of `file`,
 * called as `steps(page, { path, theme, width, touch })` after each load and before its screenshot.
 * Without a file, the steps do nothing.
 */
export async function loadSteps(file) {
  if (file === undefined) return async () => {};
  const { default: steps } = await import(pathToFileURL(resolve(file)).href);
  if (typeof steps !== 'function') throw new Error(`${file} needs a default export: async (page, { path, theme, width, touch }) => { … }`);
  return steps;
}

function freePort() {
  return new Promise((resolve, reject) => {
    const server = createServer().once('error', reject).listen(0, () => {
      const { port } = server.address();
      server.close(() => resolve(port));
    });
  });
}

async function launchChromium(chromium) {
  try {
    return await chromium.launch();
  } catch (e) {
    if (!/Executable doesn't exist/.test(e.message)) throw e;
    spawnSync('npx', ['playwright', 'install', 'chromium-headless-shell'], { stdio: 'inherit' });
    return chromium.launch();
  }
}

async function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { theme: { type: 'string' }, width: { type: 'string' }, out: { type: 'string' }, steps: { type: 'string' }, touch: { type: 'boolean', default: false } },
  });
  const { steps: stepsFile, touch, ...plan } = values;
  const tmp = process.env.CLAUDE_JOB_DIR ? join(process.env.CLAUDE_JOB_DIR, 'tmp') : tmpdir();
  const { dir, shots } = planShots(positionals, { tmp, ...plan });
  const steps = await loadSteps(stepsFile);
  mkdirSync(dir, { recursive: true });

  const { dev } = await import('astro');
  const { chromium } = await import('playwright');
  const server = await dev({
    logLevel: 'warn',
    server: { port: await freePort() },
    devToolbar: { enabled: false },
    vite: { optimizeDeps: { entries: [] } },
  });
  const browser = await launchChromium(chromium).catch(async (e) => { await server.stop(); throw e; });
  try {
    const base = `http://localhost:${server.address.port}`;
    for (const { path, theme, width, file } of shots) {
      const context = await browser.newContext(contextOptions({ theme, width, touch }));
      const page = await context.newPage();
      const response = await page.goto(base + path, { waitUntil: 'networkidle' });
      if (!response.ok()) throw new Error(`${path} returned ${response.status()}`);
      try {
        await steps(page, { path, theme, width, touch });
      } catch (e) {
        throw new Error(`${stepsFile} failed on ${path} (${theme}, ${width}px)`, { cause: e });
      }
      await page.screenshot({ path: file, fullPage: true });
      await context.close();
      console.log(file);
    }
  } finally {
    await browser.close();
    await server.stop();
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((e) => {
    console.error(e.message);
    if (e.cause) console.error(e.cause.stack);
    process.exit(1);
  });
}
