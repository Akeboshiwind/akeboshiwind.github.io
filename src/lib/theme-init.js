/**
 * Applies the remembered theme to <html> before first paint, keeps it in step with other tabs,
 * and installs `window.__setTheme(pref)` for the toggle.
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

  applyTheme(readTheme());

  dark.addEventListener('change', () => applyTheme(readTheme()));
  window.addEventListener('storage', (e) => {
    if (e.key === 'theme') applyTheme(readTheme());
  });
  window.__setTheme = (pref) => {
    set('theme', pref);
    applyTheme(pref);
  };
}
