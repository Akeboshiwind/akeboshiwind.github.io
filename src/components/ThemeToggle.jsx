import { useEffect, useState } from 'react';

const order = ['auto', 'light', 'dark'];

const readPref = () =>
  (typeof document !== 'undefined' && document.documentElement.dataset.themePref) || 'auto';

export function ThemeToggle({ className = '' }) {
  const [pref, setPref] = useState(readPref);

  useEffect(() => {
    const onStorage = (e) => { if (e.key === 'theme') setPref(readPref()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const cycle = () => {
    const next = order[(order.indexOf(pref) + 1) % order.length];
    window.__setTheme?.(next);
    setPref(next);
  };

  const label = `Theme: ${pref}`;
  const iconProps = {
    width: 16, height: 16, viewBox: '0 0 24 24',
    fill: 'none', stroke: 'currentColor', strokeWidth: 2,
    strokeLinecap: 'round', strokeLinejoin: 'round', 'aria-hidden': true,
  };

  return (
    <button
      type="button"
      onClick={cycle}
      aria-label={label}
      title={label}
      className={`inline-flex items-center justify-center w-6 h-6 rounded hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer ${className}`}
    >
      {pref === 'auto' && (
        <svg {...iconProps}>
          <rect x="3" y="4" width="18" height="13" rx="2" />
          <path d="M8 21h8M12 17v4" />
        </svg>
      )}
      {pref === 'light' && (
        <svg {...iconProps}>
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
        </svg>
      )}
      {pref === 'dark' && (
        <svg {...iconProps}>
          <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" />
        </svg>
      )}
    </button>
  );
}
