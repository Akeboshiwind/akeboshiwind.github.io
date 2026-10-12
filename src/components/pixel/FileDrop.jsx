import { useState } from 'react';

/** A file picker that also takes a drop. `onFiles` receives an array of `File`, possibly empty. */
export const FileDrop = ({ accept, multiple, onFiles, children, className = '' }) => {
  const [over, setOver] = useState(false);

  return (
    <label
      className={`pixel-file ${className}`}
      data-dragover={over || undefined}
      onDragOver={(e) => { e.preventDefault(); setOver(true); }}
      onDragLeave={(e) => { if (!e.currentTarget.contains(e.relatedTarget)) setOver(false); }}
      onDrop={(e) => { e.preventDefault(); setOver(false); onFiles([...(e.dataTransfer?.files ?? [])]); }}
    >
      <input type="file" accept={accept} multiple={multiple} onChange={(e) => onFiles([...(e.target.files ?? [])])} />
      {children}
    </label>
  );
};
