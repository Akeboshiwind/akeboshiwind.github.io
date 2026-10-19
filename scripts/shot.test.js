// @vitest-environment node
import { describe, expect, test } from 'vitest';
import { readdirSync } from 'fs';
import { join } from 'path';
import { contextOptions, loadSteps, planShots } from './shot.js';

const EXAMPLES = 'scripts/shot-steps';

describe('planShots', () => {
  test('shoots each path at both themes and both widths by default', () => {
    const { shots } = planShots(['/bill-splitter/'], { tmp: '/t' });
    expect(shots.map(({ theme, width }) => `${theme}@${width}`)).toEqual([
      'light@390', 'light@1280', 'dark@390', 'dark@1280',
    ]);
  });

  test('names each file after its path, theme and width', () => {
    const { shots } = planShots(['/bill-splitter/', '/'], { tmp: '/t', theme: 'dark', width: '390' });
    expect(shots.map((s) => s.file)).toEqual([
      '/t/shots/bill-splitter-dark-390.png',
      '/t/shots/home-dark-390.png',
    ]);
  });

  test('writes to --out when given', () => {
    const { shots } = planShots(['/kit/'], { tmp: '/t', out: '/o', theme: 'light', width: '1280' });
    expect(shots[0].file).toBe('/o/kit-light-1280.png');
  });

  test('shoots the whole page by default, and only the window with --viewport', () => {
    expect(planShots(['/'], { tmp: '/t' }).shots.every((s) => s.fullPage)).toBe(true);
    expect(planShots(['/'], { tmp: '/t', viewport: true }).shots.some((s) => s.fullPage)).toBe(false);
  });

  test('rejects a theme the site does not have', () => {
    expect(() => planShots(['/'], { tmp: '/t', theme: 'sepia' })).toThrow(/sepia/);
  });

  test('rejects a width that is not a positive integer', () => {
    expect(() => planShots(['/'], { tmp: '/t', width: '390,wide' })).toThrow(/wide/);
  });

  test('needs at least one path', () => {
    expect(() => planShots([], { tmp: '/t' })).toThrow(/path/);
  });
});

describe('contextOptions', () => {
  test('a shot is taken in a window of its width, in its theme', () => {
    expect(contextOptions({ theme: 'dark', width: 390 })).toEqual({ viewport: { width: 390, height: 900 }, colorScheme: 'dark' });
  });

  test('--touch emulates a phone, so a step can tap', () => {
    expect(contextOptions({ theme: 'light', width: 390, touch: true })).toMatchObject({ hasTouch: true, isMobile: true });
  });
});

describe('loadSteps', () => {
  test('without a file, the steps do nothing', async () => {
    const steps = await loadSteps(undefined);
    await expect(steps({}, {})).resolves.toBeUndefined();
  });

  test("a file's default export is the steps", async () => {
    const steps = await loadSteps(join(EXAMPLES, 'table-editor.mjs'));
    expect(typeof steps).toBe('function');
  });

  test('a file without a default function is rejected', async () => {
    await expect(loadSteps('scripts/shot.js')).rejects.toThrow(/default export/);
  });

  test.each(readdirSync(EXAMPLES))('the example %s loads', async (file) => {
    expect(typeof await loadSteps(join(EXAMPLES, file))).toBe('function');
  });
});
