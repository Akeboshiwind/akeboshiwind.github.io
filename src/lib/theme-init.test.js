import { describe, it, expect, beforeEach } from 'vitest';
import { ACCENTS, DEFAULT_ACCENT, DEFAULT_FACE } from './accents.js';
import { initTheme } from './theme-init.js';

const root = document.documentElement;
const accentVar = (name) => root.style.getPropertyValue(name);

describe('initTheme', () => {
  beforeEach(() => {
    localStorage.clear();
    root.removeAttribute('style');
    for (const key of Object.keys(root.dataset)) delete root.dataset[key];
  });

  it('applies the stored theme and accent choice', () => {
    localStorage.setItem('theme', 'dark');
    localStorage.setItem('accent', JSON.stringify({ id: 'h150', face: 3 }));
    initTheme();
    const green = ACCENTS.find((a) => a.id === 'h150');
    expect(root.dataset).toMatchObject({ themePref: 'dark', theme: 'dark', accent: 'h150', accentFace: '3' });
    expect(accentVar('--accent-light')).toBe(green.light.accent);
    expect(accentVar('--link-dark')).toBe(green.dark.link);
  });

  it('falls back to auto, the default accent and the default face', () => {
    localStorage.setItem('theme', 'purple');
    localStorage.setItem('accent', 'not json');
    initTheme();
    expect(root.dataset).toMatchObject({ themePref: 'auto', accent: DEFAULT_ACCENT, accentFace: String(DEFAULT_FACE) });
  });

  it('remembers what __setTheme and __setAccent are given', () => {
    initTheme();
    window.__setTheme('light');
    window.__setAccent({ id: 'h255', face: 6 });
    expect(localStorage.getItem('theme')).toBe('light');
    expect(JSON.parse(localStorage.getItem('accent'))).toEqual({ id: 'h255', face: 6 });
    expect(root.dataset).toMatchObject({ theme: 'light', accent: 'h255', accentFace: '6' });
  });
});
