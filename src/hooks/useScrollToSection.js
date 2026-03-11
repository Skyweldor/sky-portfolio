import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export function useScrollToSection() {
  const location = useLocation();
  const navigate = useNavigate();

  const scrollToSection = useCallback((sectionId) => {
    if (location.pathname === '/portfolio') {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    } else {
      navigate('/portfolio', { state: { scrollTo: sectionId } });
    }
  }, [location.pathname, navigate]);

  return scrollToSection;
}
