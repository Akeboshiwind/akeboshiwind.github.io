import { useEffect, useId, useRef } from 'react';
import { Icon } from './Icon.jsx';
import closeSvg from 'pixelarticons/svg/close.svg?raw';

const FOCUSABLE = 'a[href], button:not(:disabled), input:not(:disabled), select:not(:disabled), textarea:not(:disabled), [tabindex]:not([tabindex="-1"])';

/**
 * A modal panel over a scrim, closed by Escape, its close button or a click on the scrim.
 * While open, Tab stays inside it; on close, focus goes back to whatever opened it.
 * A body that may outgrow the sheet needs `min-h-0 overflow-y-auto` to scroll inside it.
 */
export const Sheet = ({ title, onClose, children, className = '' }) => {
  const panel = useRef(null);
  const titleId = useId();

  useEffect(() => {
    const onKeyDown = e => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onClose]);

  useEffect(() => {
    const opener = document.activeElement;
    panel.current.focus();
    // Safari doesn't focus a clicked button, so the opener can be <body>; refocusing it would only steal focus from wherever onClose put it.
    return () => { if (opener !== document.body && opener?.isConnected) opener.focus(); };
  }, []);

  const holdFocus = e => {
    if (e.key !== 'Tab') return;
    const focusable = [...panel.current.querySelectorAll(FOCUSABLE)];
    if (focusable.length === 0) return;
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    const active = document.activeElement;
    if (e.shiftKey && (active === first || active === panel.current)) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && active === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="pixel-scrim" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        tabIndex={-1}
        onKeyDown={holdFocus}
        className={`pixel-sheet ${className}`}
      >
        <header className="section-label">
          <h2 id={titleId}>{title}</h2>
          <span data-dither="fade-x" className="section-fade" aria-hidden="true" />
          <button type="button" onClick={onClose} aria-label="Close" className="pixel-button">
            <Icon svg={closeSvg} className="w-4 h-4" />
          </button>
        </header>
        {children}
      </div>
    </div>
  );
};
