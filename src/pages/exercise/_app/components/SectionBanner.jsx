import { SectionLabel } from '../../../../components/pixel/SectionLabel.jsx';

export function SectionBanner({ section }) {
  return (
    <div className="pt-4 pb-1">
      <SectionLabel>{section.name}</SectionLabel>
      {section.description && (
        <p className="text-sm opacity-70 mt-2 leading-relaxed">{section.description}</p>
      )}
    </div>
  );
}
