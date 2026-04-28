export function SectionBanner({ section }) {
  return (
    <div className="pt-4 pb-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-1">
        {section.name}
      </h2>
      {section.description && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 leading-relaxed">
          {section.description}
        </p>
      )}
    </div>
  );
}
