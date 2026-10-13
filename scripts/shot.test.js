import { describe, expect, test } from 'vitest';
import { planShots } from './shot.js';

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
