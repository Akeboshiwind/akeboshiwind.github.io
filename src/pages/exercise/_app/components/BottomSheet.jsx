import { Sheet } from '../../../../components/pixel/Sheet.jsx';

export function BottomSheet({ open, onClose, title, children }) {
  if (!open) return null;
  return (
    <Sheet title={title} onClose={onClose}>
      {/* min-h-0 lets the body shrink inside the sheet's flex column and scroll, instead of running past it in Safari. */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">{children}</div>
    </Sheet>
  );
}
