export const SectionLabel = ({ children, action, className = '' }) => (
  <h2 className={`section-label ${className}`}>
    <span>{children}</span>
    <span data-dither="fade-x" className="section-fade" aria-hidden="true" />
    {action}
  </h2>
);
