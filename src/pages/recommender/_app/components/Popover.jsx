import React, { useState, useRef, useEffect } from 'react';
import { Icon } from '../../../../components/pixel/Icon.jsx';

const item = 'label w-full px-3 py-2 text-left cursor-pointer hover:text-accent focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent';

/** An icon button that opens a short list of actions below it; `items` is `[text, onChoose]` pairs. */
export const Popover = ({ label, icon, items }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    const onKeyDown = e => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        className="pixel-button flex h-9 items-center"
      >
        <Icon svg={icon} className="w-5 h-5" />
      </button>

      {open && (
        <div className="pixel-panel absolute right-0 top-full z-20 mt-2 flex w-48 flex-col bg-bg py-1">
          {items.map(([text, onChoose]) => (
            <button
              key={text}
              type="button"
              onClick={() => { setOpen(false); onChoose(); }}
              className={item}
            >
              {text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
