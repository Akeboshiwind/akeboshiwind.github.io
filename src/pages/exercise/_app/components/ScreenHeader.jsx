export function ScreenHeader({ backLabel, onBack, title, action, titleClass = 'text-2xl' }) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <button
        type="button"
        onClick={onBack}
        className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
      >
        {backLabel}
      </button>
      <h1 className={`${titleClass} font-semibold flex-1 text-center`}>{title}</h1>
      {action ?? <span className="w-12" />}
    </div>
  );
}
