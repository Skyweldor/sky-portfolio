import React from 'react';
import BlogPage from '../components/portfolio/BlogPage';
import ThemeProvider from '../config/themeContext';
import portfolioTheme from '../themes/portfolioTheme';

export default function Blog() {
  return (
    <ThemeProvider theme={portfolioTheme}>
      <BlogPage />
    </ThemeProvider>
  );
}
