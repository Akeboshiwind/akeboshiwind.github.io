import { useEffect, useState } from 'react';

// Tiny hash router. Returns [currentPath, navigate].
// currentPath always starts with "/" (e.g. "/planner/tue").
export function useHashRoute() {
  const [path, setPath] = useState(() => readHash());

  useEffect(() => {
    const onChange = () => setPath(readHash());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  const navigate = next => {
    if (typeof window !== 'undefined') {
      window.location.hash = next.startsWith('/') ? next : '/' + next;
    }
  };

  return [path, navigate];
}

function readHash() {
  if (typeof window === 'undefined') return '/';
  const h = window.location.hash.replace(/^#/, '');
  return h || '/';
}
