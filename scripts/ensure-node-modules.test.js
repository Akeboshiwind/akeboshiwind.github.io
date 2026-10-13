import { describe, expect, test } from 'vitest';
import { execFileSync, spawnSync } from 'child_process';
import { existsSync, mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const HOOK = join(import.meta.dirname, 'ensure-node-modules.js');

function project() {
  const root = mkdtempSync(join(tmpdir(), 'ensure-nm-'));
  mkdirSync(join(root, 'dep'));
  writeFileSync(join(root, 'dep/package.json'), JSON.stringify({ name: 'dep', version: '1.0.0' }));
  writeFileSync(join(root, 'package.json'), JSON.stringify({ name: 'p', dependencies: { dep: 'file:./dep' } }));
  execFileSync('npm', ['install', '--no-audit', '--no-fund'], { cwd: root, stdio: 'ignore' });
  rmSync(join(root, 'node_modules'), { recursive: true });
  mkdirSync(join(root, 'src'));
  return root;
}

const runHook = (cwd) => spawnSync('node', [HOOK], { input: JSON.stringify({ cwd }) });

describe('ensure-node-modules hook', () => {
  test('installs from the lockfile when node_modules is missing, from a subdirectory', () => {
    const root = project();
    const { status } = runHook(join(root, 'src'));
    expect(status).toBe(0);
    expect(existsSync(join(root, 'node_modules/dep/package.json'))).toBe(true);
  });

  test('exits cleanly outside a project', () => {
    const { status } = runHook(mkdtempSync(join(tmpdir(), 'ensure-nm-empty-')));
    expect(status).toBe(0);
  });
});
