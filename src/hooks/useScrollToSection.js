import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from '../config/routes';

export function useScrollToSection() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = useCallback((sectionId) => {
    if (location.pathname === ROUTES.interactive) {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate(ROUTES.interactive, { state: { scrollTo: sectionId } });
    }
  }, [location.pathname, navigate]);

  return scrollToSection;
}
