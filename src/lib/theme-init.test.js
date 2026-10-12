import { describe, it, expect, beforeEach } from 'vitest';
import { initTheme } from './theme-init.js';

const root = document.documentElement;

describe('initTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    for (const key of Object.keys(root.dataset)) delete root.dataset[key];
  });

  it('applies the stored theme', () => {
    localStorage.setItem('theme', 'dark');
    initTheme();
    expect(root.dataset).toMatchObject({ themePref: 'dark', theme: 'dark' });
  });

  it('falls back to auto', () => {
    localStorage.setItem('theme', 'purple');
    initTheme();
    expect(root.dataset.themePref).toBe('auto');
  });

  it('remembers what __setTheme is given', () => {
    initTheme();
    window.__setTheme('light');
    expect(localStorage.getItem('theme')).toBe('light');
    expect(root.dataset).toMatchObject({ themePref: 'light', theme: 'light' });
  });
});
