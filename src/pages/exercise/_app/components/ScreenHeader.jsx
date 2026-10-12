export function ScreenHeader({ backLabel, onBack, title, action }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <button type="button" onClick={onBack} className="label shrink-0 hover:text-accent">
        {backLabel}
      </button>
      <h2 className="font-pixel text-pixel-lg text-heading flex-1 min-w-0 text-center">{title}</h2>
      {action ?? <span className="w-12 shrink-0" />}
    </div>
  );
}
