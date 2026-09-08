import { useEffect, useState } from 'react';

/**
 * Subscribes to a CSS media query and re-renders when it flips.
 *
 * Exists because the globe used to branch on a user-agent sniff evaluated once in
 * a useState initialiser — a narrowed desktop browser read as "not mobile" forever,
 * so it never fell back to the hamburger menu.
 */
export function useMediaQuery(query) {
  const [matches, setMatches] = useState(
    () => typeof window !== 'undefined' && window.matchMedia(query).matches
  );

  useEffect(() => {
    if (typeof window === 'undefined') return undefined;

    const mql = window.matchMedia(query);
    const onChange = (e) => setMatches(e.matches);

    // Sync immediately — the query may have changed between render and effect.
    setMatches(mql.matches);
    mql.addEventListener('change', onChange);
    return () => mql.removeEventListener('change', onChange);
  }, [query]);

  return matches;
}

export default useMediaQuery;
