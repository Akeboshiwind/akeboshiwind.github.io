import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { ACCENTS, DEFAULT_ACCENT, DEFAULT_FACE } from './accents.js';
import { REROLL_GRACE_MS, wireAccentToggle } from './accent-toggle.js';

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
    root.dataset.accent = DEFAULT_ACCENT;
    wireAccentToggle(btn);
    expect(btn.getAttribute('aria-label')).toBe('Accent: Orange. Re-roll');
  });

  it('offers a reset on a fresh page with a non-default accent, and a press restores the defaults', () => {
    root.dataset.accent = 'h150';
    root.dataset.accentFace = '2';
    wireAccentToggle(btn);
    expect(btn.hasAttribute('data-rerolling')).toBe(false);
    expect(btn.getAttribute('aria-label')).toBe('Accent: Green. Reset to Orange');
    btn.click();
    expect(window.__setAccent).toHaveBeenCalledWith({ id: DEFAULT_ACCENT, face: DEFAULT_FACE });
    expect(btn.getAttribute('aria-label')).toBe('Accent: Orange. Re-roll');
  });

  describe('after a re-roll', () => {
    beforeEach(() => vi.useFakeTimers());
    afterEach(() => vi.useRealTimers());

    const rerollOnce = () => {
      root.dataset.accent = DEFAULT_ACCENT;
      wireAccentToggle(btn);
      btn.click();
    };

    it('keeps re-rolling while presses come within the grace period', () => {
      rerollOnce();
      for (let i = 0; i < 5; i++) {
        vi.advanceTimersByTime(REROLL_GRACE_MS - 1);
        expect(btn.hasAttribute('data-rerolling')).toBe(true);
        expect(btn.getAttribute('aria-label')).toMatch(/Re-roll$/);
        btn.click();
      }
      expect(btn.hasAttribute('data-rerolling')).toBe(true);
    });

    it('offers the reset once the grace period passes without a press', () => {
      rerollOnce();
      vi.advanceTimersByTime(REROLL_GRACE_MS);
      expect(btn.hasAttribute('data-rerolling')).toBe(false);
      expect(btn.getAttribute('aria-label')).toMatch(/Reset to Orange$/);
    });
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
