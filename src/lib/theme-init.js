import { ACCENTS, parseChoice, serialiseChoice } from './accents.js';

const ACCENT_VARS = [
  ['--accent-light', 'light', 'accent'],
  ['--link-light', 'light', 'link'],
  ['--accent-dark', 'dark', 'accent'],
  ['--link-dark', 'dark', 'link'],
];

/**
 * Applies the remembered theme and accent to <html> before first paint, keeps them in step with other tabs,
 * and installs `window.__setTheme(pref)` and `window.__setAccent({ id, face })` for the toggles.
 */
export function initTheme() {
  const root = document.documentElement;
  const dark = window.matchMedia('(prefers-color-scheme: dark)');
  const get = (key) => { try { return localStorage.getItem(key); } catch { return null; } };
  const set = (key, value) => { try { localStorage.setItem(key, value); } catch {} };

  const readTheme = () => {
    const pref = get('theme');
    return pref === 'light' || pref === 'dark' ? pref : 'auto';
  };
  const applyTheme = (pref) => {
    root.dataset.themePref = pref;
    root.dataset.theme = pref === 'auto' ? (dark.matches ? 'dark' : 'light') : pref;
  };
  const applyAccent = ({ id, face }) => {
    const accent = ACCENTS.find((a) => a.id === id);
    root.dataset.accent = id;
    root.dataset.accentFace = String(face);
    for (const [name, theme, key] of ACCENT_VARS) root.style.setProperty(name, accent[theme][key]);
  };

  root.classList.add('js');
  applyTheme(readTheme());
  applyAccent(parseChoice(get('accent')));

  dark.addEventListener('change', () => applyTheme(readTheme()));
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') applyTheme(readTheme());
    if (e.key === 'accent') applyAccent(parseChoice(get('accent')));
  });
  window.__setTheme = (pref) => {
    set('theme', pref);
    applyTheme(pref);
  };
  window.__setAccent = (choice) => {
    set('accent', serialiseChoice(choice));
    applyAccent(choice);
  };
}
