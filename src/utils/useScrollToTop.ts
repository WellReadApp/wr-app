import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Custom hook to scroll to top when the route changes or specific dependencies change
 * @param dependencies - Optional array of dependencies to watch for changes
 */
export const useScrollToTop = (dependencies: any[] = []) => {
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname, ...dependencies]);
};