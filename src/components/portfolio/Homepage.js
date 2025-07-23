import React from 'react';
import { NavBar } from '../common/NavBar';
import { Banner } from '../common/Banner';
import { Skills } from './Skills';
import { Projects } from './Projects';
import 'bootstrap/dist/css/bootstrap.min.css';

function HomePage() {
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
