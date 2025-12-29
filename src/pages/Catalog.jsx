import React from 'react';
import { Container } from 'react-bootstrap';
import { NavBar } from '../components/common/NavBar';
import Footer from '../components/common/Footer';

const Catalog = () => {
  return (
    <div>
      <NavBar />
      <section style={{
        minHeight: '100vh',
        paddingTop: '120px',
        paddingBottom: '80px',
        backgroundColor: 'var(--color-bg-dark)'
      }}>
        <Container>
          <h1 style={{
            fontFamily: '"DotGothic16", sans-serif',
            fontSize: 'clamp(2rem, 5vw, 3.5rem)',
            textAlign: 'center',
            color: 'var(--color-text-light)',
            textShadow: `
              0 0 10px var(--color-primary),
              0 0 20px var(--color-primary),
              0 0 40px var(--color-primary)
            `,
            marginBottom: '40px'
          }}>
            Downloads
          </h1>
          <p style={{
            textAlign: 'center',
            color: 'var(--color-text-dark)',
            fontSize: '18px',
            maxWidth: '600px',
            margin: '0 auto'
          }}>
            Coming soon - downloadable games, demos, and resources from SynthCity DigiLabs.
          </p>
        </Container>
      </section>
      <Footer />
    </div>
  );
};

export default Catalog;
