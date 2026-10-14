import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ACCENTS, DEFAULT_ACCENT } from './accents.js';
import { wireAccentToggle } from './accent-toggle.js';

const root = document.documentElement;
const accentName = (id) => ACCENTS.find((a) => a.id === id).name;

describe('wireAccentToggle', () => {
  let btn;

  beforeEach(() => {
    for (const key of Object.keys(root.dataset)) delete root.dataset[key];
    window.__setAccent = vi.fn(({ id, face }) => {
      root.dataset.accent = id;
      root.dataset.accentFace = String(face);
    });
    btn = document.createElement('button');
  });

  afterEach(() => {
    delete window.__setAccent;
  });

  it('labels the button with the current accent', () => {
    root.dataset.accent = 'h150';
    wireAccentToggle(btn);
    expect(btn.getAttribute('aria-label')).toBe('Accent: Green. Re-roll');
  });

  it('re-rolls to a different accent and face on a press, and relabels', () => {
    root.dataset.accent = DEFAULT_ACCENT;
    root.dataset.accentFace = '5';
    wireAccentToggle(btn);
    btn.click();
    const [{ id, face }] = window.__setAccent.mock.calls[0];
    expect(id).not.toBe(DEFAULT_ACCENT);
    expect(face).not.toBe(5);
    expect(btn.getAttribute('aria-label')).toBe(`Accent: ${accentName(id)}. Re-roll`);
  });
});
