export const inputClass = 'pixel-field w-full text-base';

export function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1">
      <span className="label">{label}</span>
      {children}
    </label>
  );
}
