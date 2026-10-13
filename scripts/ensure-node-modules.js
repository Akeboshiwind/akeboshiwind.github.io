#!/usr/bin/env node

import { spawnSync } from 'child_process';
import { createHash } from 'crypto';
import { existsSync, mkdirSync, readFileSync, rmSync, statSync } from 'fs';
import { tmpdir } from 'os';
import { dirname, join } from 'path';

const LOCK_WAIT_MS = 60_000;
// matches the hook's `timeout` in .claude/settings.json: no live run holds the lock longer
const LOCK_STALE_MS = 180_000;

function projectRoot(dir) {
  for (let d = dir; ; d = dirname(d)) {
    if (existsSync(join(d, 'package-lock.json'))) return d;
    if (d === dirname(d)) return null;
  }
}

function acquire(lock) {
  const deadline = Date.now() + LOCK_WAIT_MS;
  for (;;) {
    try {
      mkdirSync(lock);
      return true;
    } catch (e) {
      if (e.code !== 'EEXIST' || Date.now() > deadline) return false;
      if (Date.now() - statSync(lock).mtimeMs > LOCK_STALE_MS) {
        rmSync(lock, { recursive: true, force: true });
        continue;
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 500);
    }
  }
}

const { cwd } = JSON.parse(readFileSync(0, 'utf8'));
const root = cwd && projectRoot(cwd);

if (root && !existsSync(join(root, 'node_modules'))) {
  const lock = join(tmpdir(), `npm-ci-${createHash('sha1').update(root).digest('hex')}`);
  if (acquire(lock)) {
    try {
      // a parallel call may have installed while this one waited for the lock
      if (!existsSync(join(root, 'node_modules'))) {
        spawnSync('npm', ['ci', '--no-audit', '--no-fund'], { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] });
      }
    } finally {
      rmSync(lock, { recursive: true, force: true });
    }
  }
}
