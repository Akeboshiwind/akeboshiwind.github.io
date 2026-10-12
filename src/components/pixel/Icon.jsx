/** A pixelarticons SVG, imported by the caller as `pixelarticons/svg/<name>.svg?raw`. */
export const Icon = ({ svg, className = 'w-5 h-5' }) => (
  <span aria-hidden="true" className={`pixel-icon ${className}`} dangerouslySetInnerHTML={{ __html: svg }} />
);
