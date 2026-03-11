import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { NavBar } from '../common/NavBar';
import { Banner } from '../common/Banner';
import { Skills } from './Skills';
import { Projects } from './Projects';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
  const location = useLocation();

  useEffect(() => {
    if (location.state?.scrollTo) {
      const timer = setTimeout(() => {
        const element = document.getElementById(location.state.scrollTo);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        window.history.replaceState({}, document.title);
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [location.state]);

  return (
    <div className="App">
      <NavBar />
      <Banner />
      <Skills />
      <Projects />
    </div>
  );
}

export default HomePage;
