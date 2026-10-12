import { describe, test, expect, vi, afterEach } from 'vitest';
import { useState } from 'react';
import { render, screen, cleanup, fireEvent } from '@testing-library/react';
import { Sheet } from '../components/pixel/Sheet.jsx';

afterEach(cleanup);

const Opener = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button onClick={() => setOpen(true)}>Open</button>
      {open && (
        <Sheet title="Choose" onClose={() => setOpen(false)}>
          <button>First</button>
          <button>Last</button>
        </Sheet>
      )}
    </>
  );
};

describe('Sheet', () => {
  test('is a modal dialog named by its title', () => {
    render(<Sheet title="All meals" onClose={() => {}}>body</Sheet>);
    const dialog = screen.getByRole('dialog', { name: 'All meals' });
    expect(dialog.getAttribute('aria-modal')).toBe('true');
  });

  test('closes on Escape, its close button and the scrim, but not a click inside', () => {
    const onClose = vi.fn();
    render(<Sheet title="All meals" onClose={onClose}><p>body</p></Sheet>);

    fireEvent.click(screen.getByText('body'));
    expect(onClose).not.toHaveBeenCalled();

    fireEvent.keyDown(document, { key: 'Escape' });
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    fireEvent.click(screen.getByRole('dialog').parentElement);
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  test('takes focus when it opens and hands it back when it closes', () => {
    render(<Opener />);
    const opener = screen.getByRole('button', { name: 'Open' });
    opener.focus();

    fireEvent.click(opener);
    expect(screen.getByRole('dialog').contains(document.activeElement)).toBe(true);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.activeElement).toBe(opener);
  });

  test('leaves focus where onClose put it when nothing had focus before', () => {
    const Elsewhere = () => {
      const [open, setOpen] = useState(true);
      return (
        <>
          <button>Elsewhere</button>
          {open && (
            <Sheet title="Choose" onClose={() => { setOpen(false); screen.getByRole('button', { name: 'Elsewhere' }).focus(); }}>
              body
            </Sheet>
          )}
        </>
      );
    };
    document.activeElement?.blur();
    render(<Elsewhere />);

    fireEvent.keyDown(document, { key: 'Escape' });
    expect(document.activeElement).toBe(screen.getByRole('button', { name: 'Elsewhere' }));
  });

  test('keeps Tab inside itself', () => {
    render(<Opener />);
    fireEvent.click(screen.getByRole('button', { name: 'Open' }));
    const close = screen.getByRole('button', { name: 'Close' });
    const last = screen.getByRole('button', { name: 'Last' });

    last.focus();
    fireEvent.keyDown(last, { key: 'Tab' });
    expect(document.activeElement).toBe(close);

    fireEvent.keyDown(close, { key: 'Tab', shiftKey: true });
    expect(document.activeElement).toBe(last);
  });
});
