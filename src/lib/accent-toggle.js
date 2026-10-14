import { ACCENTS, nextAccent, nextFace } from './accents.js';

/** Wires the accent button: a press re-rolls the accent and dice face, and the label names the current accent. */
export function wireAccentToggle(btn, root = document.documentElement) {
  const sync = () => {
    const name = ACCENTS.find((a) => a.id === root.dataset.accent)?.name ?? ACCENTS[0].name;
    const label = `Accent: ${name}. Re-roll`;
    btn.setAttribute('aria-label', label);
    btn.setAttribute('title', label);
  };
  btn.addEventListener('click', () => {
    window.__setAccent?.({
      id: nextAccent(root.dataset.accent ?? ''),
      face: nextFace(Number(root.dataset.accentFace)),
    });
    sync();
  });
  window.addEventListener('storage', (e) => { if (e.key === 'accent') sync(); });
  sync();
}
