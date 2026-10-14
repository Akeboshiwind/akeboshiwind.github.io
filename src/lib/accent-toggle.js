import { ACCENTS, DEFAULT_ACCENT, DEFAULT_FACE, nextAccent, nextFace } from './accents.js';

/** How long after a re-roll the button stays a die, so a run of presses never lands on the reset. */
export const REROLL_GRACE_MS = 5000;

const nameOf = (id) => ACCENTS.find((a) => a.id === id)?.name ?? ACCENTS[0].name;

/**
 * Wires the accent button. It re-rolls the accent and dice face; with a non-default accent and no re-roll on this
 * page in the last `REROLL_GRACE_MS`, it resets both to their defaults instead. `data-rerolling` marks the grace
 * period, and the button's CSS draws the die or the back arrow from it and the root's `data-accent`.
 */
export function wireAccentToggle(btn, root = document.documentElement) {
  let grace;
  const offersReset = () => root.dataset.accent !== DEFAULT_ACCENT && !btn.hasAttribute('data-rerolling');
  const sync = () => {
    const label = `Accent: ${nameOf(root.dataset.accent)}. ${offersReset() ? `Reset to ${nameOf(DEFAULT_ACCENT)}` : 'Re-roll'}`;
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  };
  btn.addEventListener('click', () => {
    if (offersReset()) {
      window.__setAccent?.({ id: DEFAULT_ACCENT, face: DEFAULT_FACE });
    } else {
      window.__setAccent?.({
        id: nextAccent(root.dataset.accent ?? ''),
        face: nextFace(Number(root.dataset.accentFace)),
      });
      btn.setAttribute('data-rerolling', '');
      clearTimeout(grace);
      grace = setTimeout(() => { btn.removeAttribute('data-rerolling'); sync(); }, REROLL_GRACE_MS);
    }
    sync();
  });
  window.addEventListener('storage', (e) => { if (e.key === 'accent') sync(); });
  sync();
}
