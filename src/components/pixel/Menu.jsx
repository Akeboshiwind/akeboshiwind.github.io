import { useEffect, useId, useRef, useState } from 'react';
import { Icon } from './Icon.jsx';

const enabledItems = list => [...list.querySelectorAll('[role="menuitem"]:not(:disabled)')];

/**
 * An icon button that opens a list of actions; `items` is `{ label, onSelect, disabled }`.
 * Closes on Escape, a press outside, Tab or a choice; Escape and a choice put focus back on the trigger.
 * `side="top"` opens it upward, for a trigger at the bottom of the screen.
 */
export const Menu = ({ label, icon, items, side = 'bottom', onOpenChange, className = '', triggerClassName = '' }) => {
  const [open, setOpen] = useState(false);
  const focusOnOpen = useRef('first');
  const root = useRef(null);
  const trigger = useRef(null);
  const list = useRef(null);
  const menuId = useId();

  useEffect(() => { onOpenChange?.(open); }, [open, onOpenChange]);

  useEffect(() => {
    if (!open) return;
    const items = enabledItems(list.current);
    (focusOnOpen.current === 'last' ? items.at(-1) : items[0])?.focus();

    const onPointerDown = e => { if (!root.current.contains(e.target)) setOpen(false); };
    const onKeyDown = e => {
      if (e.key !== 'Escape') return;
      setOpen(false);
      trigger.current.focus();
    };
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  const openOn = where => {
    focusOnOpen.current = where;
    setOpen(true);
  };

  const onTriggerKeyDown = e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); openOn('first'); }
    if (e.key === 'ArrowUp') { e.preventDefault(); openOn('last'); }
  };

  const onListKeyDown = e => {
    if (e.key === 'Tab') { setOpen(false); return; }
    const items = enabledItems(list.current);
    const i = items.indexOf(document.activeElement);
    const last = items.length - 1;
    const target = {
      ArrowDown: i === last ? 0 : i + 1,
      ArrowUp: i <= 0 ? last : i - 1,
      Home: 0,
      End: last,
    }[e.key];
    if (target === undefined) return;
    e.preventDefault();
    items[target]?.focus();
  };

  const choose = onSelect => {
    setOpen(false);
    trigger.current.focus();
    onSelect();
  };

  return (
    <div ref={root} className={`pixel-menu ${className}`}>
      <button
        ref={trigger}
        type="button"
        onClick={() => (open ? setOpen(false) : openOn('first'))}
        onKeyDown={onTriggerKeyDown}
        aria-label={label}
        title={label}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        className={`pixel-button pixel-menu-trigger ${triggerClassName}`}
      >
        <Icon svg={icon} />
      </button>

      {open && (
        <div ref={list} id={menuId} role="menu" aria-label={label} data-side={side} onKeyDown={onListKeyDown} className="pixel-menu-list">
          {items.map(({ label: text, onSelect, disabled }) => (
            <button
              key={text}
              type="button"
              role="menuitem"
              tabIndex={-1}
              disabled={disabled}
              onClick={() => choose(onSelect)}
              className="pixel-menu-item"
            >
              {text}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
