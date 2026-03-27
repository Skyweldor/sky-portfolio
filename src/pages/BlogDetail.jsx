import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import { NavBar } from '../components/common/NavBar';
import { getDetailById } from '../data/catalogDetailData';
// import BlogDetailLayoutA from '../components/blog/BlogDetailLayoutA';
// import BlogDetailLayoutB from '../components/blog/BlogDetailLayoutB';
import BlogDetailLayoutC from '../components/blog/BlogDetailLayoutC';

// const LAYOUTS = {
//   a: BlogDetailLayoutA,
//   b: BlogDetailLayoutB,
//   c: BlogDetailLayoutC,
// };

const BlogDetail = () => {
  const { id } = useParams();
  const item = getDetailById(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  // Layout C is the default layout
  const LayoutComponent = BlogDetailLayoutC;

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
      <LayoutComponent item={item} />
    </div>
  );
};

export default BlogDetail;
