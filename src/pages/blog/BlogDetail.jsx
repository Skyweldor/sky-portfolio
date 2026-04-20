import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { NavBar } from '../../components/common/NavBar';
import { getDetailById } from '../../data/catalogDetailData';
import BlogDetailLayoutC from '../../components/blog/BlogDetailLayoutC';
import BlogDetailLayoutD from '../../components/blog/BlogDetailLayoutD';

const LAYOUTS = {
  c: { component: BlogDetailLayoutC, label: 'Terminal' },
  d: { component: BlogDetailLayoutD, label: 'Journal' },
};

const BlogDetail = () => {
  const { id } = useParams();
  const item = getDetailById(id);
  const [activeLayout, setActiveLayout] = useState('c');

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  const LayoutComponent = LAYOUTS[activeLayout].component;

  if (!item) {
    return (
      <div>
        <NavBar />
        <section style={{
          minHeight: '100vh',
          paddingTop: '140px',
          backgroundColor: 'var(--color-bg-dark)',
          textAlign: 'center',
        }}>
          <Container>
            <h1 style={{
              fontFamily: '"DotGothic16", sans-serif',
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              color: 'var(--color-text-light)',
              textShadow: '0 0 10px var(--color-primary)',
              marginBottom: '16px',
            }}>
              Item Not Found
            </h1>
            <p style={{ color: 'var(--color-text-dark)', marginBottom: '32px' }}>
              The item you're looking for doesn't exist or has been removed.
            </p>
            <Link
              to="/downloads"
              style={{
                color: 'var(--color-highlight)',
                textDecoration: 'none',
                fontSize: '16px',
              }}
            >
              &larr; Back to Downloads
            </Link>
          </Container>
        </section>
      </div>
    );
  }

  return (
    <div>
      <NavBar />
      {/* Layout toggle */}
      <div style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 999,
        display: 'flex',
        gap: '0',
        borderRadius: '4px',
        overflow: 'hidden',
        border: '1px solid rgba(255,255,255,0.15)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
        fontFamily: "'Press Start 2P', monospace",
        fontSize: '7px',
      }}>
        {Object.entries(LAYOUTS).map(([key, { label }]) => (
          <button
            key={key}
            onClick={() => setActiveLayout(key)}
            style={{
              padding: '10px 14px',
              background: activeLayout === key
                ? 'rgba(245,200,66,0.2)'
                : 'rgba(13,15,26,0.95)',
              color: activeLayout === key ? '#f5c842' : '#6b7199',
              border: 'none',
              cursor: 'pointer',
              letterSpacing: '0.05em',
              transition: 'all 0.2s ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>
      <LayoutComponent item={item} />
    </div>
  );
};

export default BlogDetail;
